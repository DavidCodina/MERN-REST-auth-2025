import { Fragment, useEffect /* , useState */ } from 'react'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller
} from 'react-hook-form'
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
    )
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  name: 'Dave'
}

/* ========================================================================

======================================================================== */
// Whether you are implementing a controlled form field with react-hook-form's
// Controller or doing it from scratch, the Input does not need any extra logic
// for this to work (i.e., no two-way binding stuff, etc.).

export const ControlledInputDemo = () => {
  // const [controlledValue, setControlledValue] = useState('David')

  const {
    // register,
    reset,
    handleSubmit,
    getValues,
    control,
    // trigger,
    watch,
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

  ///////////////////////////////////////////////////////////////////////////
  //
  // watch alternative:
  //
  //   onChange={(e) => {
  //     onChange(e)
  //     console.log('number:', e.target.value)
  //   }}
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const subscription = watch((values) => {
      console.log('watched name:', values.name)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // useEffect(() => {
  //   console.log('controlledValue:', controlledValue)
  // }, [controlledValue])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <Fragment>
        <form
          className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate // Not really needed, but doesn't hurt.
        >
          {/* =====================
       
          ===================== */}

          <Controller
            control={control}
            name='name'
            render={({ field }) => {
              const { onChange, onBlur, value, ref, disabled } = field

              // console.log({ 'field.value': value })
              return (
                <Input
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // In practice, you could do this:
                  //
                  //   const [controlledValue, setControlledValue] = useState('')
                  //
                  //   ...
                  //
                  //   onChange={(e) => {
                  //     setControlledValue(e.target.value)
                  //     onChange(e)
                  //   }}
                  //   value={controlledValue}
                  //
                  // However, if you're using react-hook-form, then that's kind of redundant.
                  // Instead, the Controller handles all of that for you, and your state
                  // is managed by react-hook-form already.
                  //
                  // That said, I'm doing it here for testing purposes.
                  //
                  ///////////////////////////////////////////////////////////////////////////
                  onChange={onChange}
                  value={value}
                  // onChange={(e) => {
                  //   setControlledValue(e.target.value)
                  //   onChange(e)
                  // }}
                  // value={controlledValue}
                  onBlur={onBlur}
                  ref={ref}
                  disabled={disabled}
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
                />
              )
            }}
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
