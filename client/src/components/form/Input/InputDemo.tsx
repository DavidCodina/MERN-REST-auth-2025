import { Fragment, useEffect, useRef } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { Input } from './'

const schema = z.object({
  name: z
    .string()
    .min(1, 'Required.')

    // The regex is saying
    // 'Allow any character 1 or more times, except a space': [^\s]
    // 'Allow a space plus any character (1 or more times), except a space - 0 or more times: (\s+[^\s]+)*
    // This regex will implicitly check for '     ' as well.
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  ///////////////////////////////////////////////////////////////////////////
  //
  // Validating numbers can be a little tricky with Zod.
  // The goal is to validate it as if it were a number, but
  // without actually, changing the value to a number.
  //
  // One gotcha is that z.coerce.number() will coerce
  // ''/undefined to 0, so we have to be careful to prevent
  // this from happening. This can be done by doing a preliminary
  // string check:
  //
  //   z.string().min(1, 'Required.')
  //
  // If this fails, then the rest of chain will short-circuit.
  //
  // The next step is to test the value as a number.
  // In previous versions of Zod we probably would've
  // used z.preprocess() with .transform() appended to the
  // end to transform back to a string.
  //
  // However, now we can use .pipe() to handle the number validation.
  // Then use .pipe() again to 'transform' back to a string.
  // Conversely, if we skip this step if we actually want the
  // result to be a number.
  //
  ///////////////////////////////////////////////////////////////////////////
  age: z
    .string()
    // Basic string validation - invalidate if ''
    .min(1, 'Required.')
    ///////////////////////////////////////////////////////////////////////////
    //
    // regex string validation to prevent leading zeros.
    // Technically not necessary because coercing to a number will
    // strip leading zeros.
    //
    // What does this mean? (  https://bard.google.com/chat/3937f0aa924c71a1  )
    //
    //   /^((\.[0-9]+)|0(\.[0-9]*)?|(?!0)([0-9]+)(\.[0-9]*)?)$/
    //
    // 1. (\.[0-9]+)
    //    The string can start with '.' followed by 1 or more numbers.
    //
    // 2. 0(\.[0-9]*)?
    //    The string can start with 0. Optionally, it can be followed by a '.' and 0 or more numbers.
    //
    // 3. (?!0)([0-9]+)(\.[0-9]*)?
    // The string can be one or more numbers, but can't have a leading zero.
    // It can also be followed by a '.' with 0 or more numbers.
    //
    // Of course, if you wanted values like '09.35', then you wouldn't want to do
    // this kind of thing. The above regex allows floats, but .int() below prohibits it.
    //
    ///////////////////////////////////////////////////////////////////////////
    .regex(
      /^((\.[0-9]+)|0(\.[0-9]*)?|(?!0)([0-9]+)(\.[0-9]*)?)$/,
      "The number can't have leading zeros."
    )
    .min(1, 'Required dummy')

    // The number input also allows e, + and -
    // https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in
    .pipe(z.coerce.number().min(0).max(100).int()) // Coerce to number and validate as number.

    // Coerce back to string.
    .pipe(
      z.coerce.string()
      // If we were dealing with dollar amounts, we may want to use .transform()
      // to reappend decimal places.
      // .transform( ... )
    ),

  email: z.string().email("That's not an email you dummy!"),

  // In theory, if we set type="date", then z.string().min(1, 'Required.')
  // should be sufficient. However, just to be extra sure we can do this:
  // https://bard.google.com/chat/0a2479d72559b2d3
  dob: z
    .string()
    .min(1, 'Required.')
    .regex(
      /^(?:\d{4}-(?:0[1-9]|1[012])-(?:0[1-9]|[12]\d|3[01]))$/,
      'Invalid date.'
    ),

  time: z
    .string()
    .regex(
      // This regex allows any hours 00-23 and any minutes 00-59.
      new RegExp(/^([0-1]\d|2[0-3]):[0-5]\d$/),
      'Time should be nn:nn.'
    )
    .refine(
      (value) => {
        const hours = value.substring(0, 2)
        if (hours.startsWith('0') && parseInt(hours[1] as string) <= 6) {
          return false
        }
        return true
      },

      {
        message: "You cRaZy! That's too early!"
      }
    )
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  name: 'David',
  age: '',
  email: 'david@example.com',
  dob: '', //'1978-05-09',
  time: ''
}

/* ========================================================================

======================================================================== */

export const InputDemo = () => {
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    // watch,
    formState: {
      errors,
      isValid,
      touchedFields,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
    }
  } = useForm<FormValues>({
    defaultValues: defaultValues,

    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field components
    // are designed to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
    console.log('onSubmit called.', data)
    await sleep(1000) // await API call
  }

  /* ======================
        onError()
  ====================== */

  const onError: SubmitErrorHandler<FormValues> = (errors, _e) => {
    const values = getValues()
    console.log({ values, errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})
      toast.success('Form validation success!')
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (nameInputRef.current) {
      console.log(nameInputRef.current)
    }
  }, [])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    // If you want to use a custom ref, then you have to pull the ref
    // off of react-hook-form's register().
    // then see the ref prop below for the rest of the implementation.
    const { ref, ...otherNameProps } = register('name', {})
    return (
      <Fragment>
        <form
          className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate
        >
          {/* =====================
       
          ===================== */}

          <Input
            className=''
            // disabled
            error={errors?.name?.message}
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            id='name'
            label='Name'
            labelClassName=''
            labelRequired
            labelStyle={{}}
            placeholder='Name...'
            size='sm'
            style={{}}
            touched={touchedFields?.name}
            // Here you would nee to pass an arrow function with node as the arg.
            // Then assign node to the custom nameInputRef. Then manually implement
            // the react-hook-form functionality by calling its ref(node). Yes, it's
            // a function. That said, the best way to handle it is as follows:
            ref={(node) => {
              if (ref && 'current' in ref) {
                ref.current = node
              } else if (typeof ref === 'function') {
                ref?.(node)
              }

              nameInputRef.current = node
            }}
            {...otherNameProps}
          />

          <Input
            className=''
            error={errors?.age?.message}
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            id='age'
            label='age'
            labelClassName=''
            labelRequired
            labelStyle={{}}
            placeholder='Age...'
            size='sm'
            style={{}}
            touched={touchedFields?.age}
            type='number'
            {...register('age', {
              // disabled: true
            })}
          />

          <Input
            className=''
            error={errors?.email?.message}
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            id='email'
            label='Email'
            labelClassName=''
            labelRequired
            labelStyle={{}}
            placeholder='Email...'
            size='sm'
            style={{}}
            touched={touchedFields?.email}
            type='email'
            {...register('email', {
              // disabled: true
            })}
          />

          <Input
            className=''
            error={errors?.dob?.message}
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            id='dob'
            label='Date of Birth'
            labelClassName=''
            labelRequired
            labelStyle={{}}
            placeholder='Date of Birth...'
            size='sm'
            style={{}}
            touched={touchedFields?.dob}
            type='date'
            {...register('dob', {
              // disabled: true
            })}
          />

          {/* 
          Interesting behavior of type='time'
          If user types 17 for hours, it converts to 05:-- PM.
          If user types 05:00 PM for hours, the actual stored value will be '17:00'
          If user types just 05:30 -- they will still need to enter AM/PM in the field.
          AM/PM doesn't get included in the value, but helps the field determine if 05:30
          should be as is, or converted to 17:30. The AM/PM part is not immediately intuitive.

          The type='time' compoonent is NOT IE11 compatible,  but degrades gracefully to a text input.
          In order to enforce the expected format, we should include a regex.
          This regex allows any hours 00-23 and any minutes 00-59:

            time: z.string().regex(
              new RegExp(/^([0-1]\d|2[0-3]):[0-5]\d$/), 
              'Invalid tiem. Time should be nn:nn (e.g., 05:30)'
            )

          If you need to set, min/max do it through the the Zod .regex() or .refine(). For example:

          .refine(
            (value) => {
              const hours = value.substring(0, 2)
              if (hours.startsWith('0') && parseInt(hours[1]) <= 6) { return false }
              return true
            },
            { message: "You cRaZy! That's too early!" }
          )
          */}

          <Input
            className=''
            error={errors?.time?.message}
            formGroupClassName='mb-4'
            formText=''
            id='time'
            label='Time'
            labelRequired
            // N/A for type='time'. However, we can still use it for when
            // type='time' gracefully degrades to type='text'.
            placeholder='nn:nn ([00-23]:[00-59]).'
            size='sm'
            type='time'
            touched={touchedFields?.time}
            {...register('time')}
          />

          {/* =====================
                Submit Button
          ===================== */}

          {isSubmitting ? (
            <button
              className='btn-green btn-sm block w-full'
              disabled
              type='button'
            >
              <span
                aria-hidden='true'
                className='spinner-border spinner-border-sm mr-2'
                role='status'
              ></span>
              Submitting...
            </button>
          ) : (
            <button
              className='btn-green btn-sm flex w-full'
              // You could also add || !isDirty. In the case of an update form,
              // it still makes sense because there's no need to send an update if
              // nothing's actually been updated.
              disabled={isSubmitted && !isValid ? true : false}
              onClick={handleSubmit(onSubmit, onError)}
              type='button'
            >
              {isSubmitted && !isValid ? (
                <Fragment>
                  <TriangleAlert className='pointer-events-none size-[1.25em]' />{' '}
                  Please Fix Errors...
                </Fragment>
              ) : (
                'Submit'
              )}
            </button>
          )}
        </form>
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}
