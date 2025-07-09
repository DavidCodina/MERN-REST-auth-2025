import { ComponentProps, Fragment, useLayoutEffect, useEffect } from 'react'
import { toast } from 'react-toastify'

import { isValidPhoneNumber } from 'react-phone-number-input'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert } from 'lucide-react'

import {
  InputPhoneNational,
  getCountryNameFromCountryCode
  // CountryCode
} from './'
import { sleep } from 'utils'

type CountryCode = ComponentProps<typeof InputPhoneNational>['country']

const country: CountryCode = 'GB'

const schema = z.object({
  phone: z
    .string()
    .min(1, 'Required.')
    // This regext will validate against the actual value, NOT the rendered value.
    .regex(/^[+0-9]+$/, 'Invalid character.')
    // We could do this, but it may not be a good idea if you're validating an edit form.
    // Why? Because it's possible that the number technicallly looks correct in the UI.
    // (e.g., '01782 830038' or '(206) 555-4433'), but are actually using the fallback input,
    // so the value is not in E.164 format. For now, I've left it in, but be aware that this
    // is potentially a bad idea for edit forms.
    .refine(
      (value) => {
        const isValid = isValidPhoneNumber(value)
        return isValid
      },
      {
        message: 'The number is invalid.'
      }
    )
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  phone: '' // '+441782830038'
}

/* ========================================================================
                    RHFControlledInputPhoneNationalDemo 
======================================================================== */
// react-phone-number-input has components that integrate with react-hook-form:
// https://gitlab.com/catamphetamine/react-phone-number-input#react-hook-form
// However, I'm not going to have a separate implementation just for react-hook-form.
// We can still use react-hook-form's Controller.

export const RHFControlledInputPhoneNationalDemo = () => {
  const {
    // register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    watch,
    control,
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
      // reset(undefined, {})
      reset({ phone: '' }, {})
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
  // Gotcha: when the InputNumber component first mounts, it finds the value/defaultValue
  // formats it, then set the value through the DOM node. Then it calls onChange(e) to pass
  // the formattted value back to the consuming environment. All of this happens before
  // the watcher first runs.
  //
  // This is normal useEffect() beavior - useEffect runs AFTER the render. This
  // means that the useEffect() and watch() subscription will miss the first change.
  // To fix this, you need to implement a useLayoutEffect() and not useEffect().
  //
  ///////////////////////////////////////////////////////////////////////////

  useLayoutEffect(() => {
    const subscription = watch((values) => {
      console.log('watched number:', { phone: values.phone })
    })
    return () => subscription.unsubscribe()
  }, [watch])

  /* ======================
        renderPhone()
  ====================== */

  const renderPhone = () => {
    const phone = watch('phone')
    return (
      <div className='mb-12 text-center text-3xl font-bold text-blue-500'>
        phone: {phone}
      </div>
    )
  }

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
          noValidate
        >
          {/* =====================
       
          ===================== */}

          <Controller
            control={control}
            name='phone'
            render={({ field }) => {
              const { onChange, onBlur, value, ref: inputRef, disabled } = field

              return (
                <InputPhoneNational
                  ref={inputRef}
                  className=''
                  country={country} // Default: 'US'
                  disabled={disabled}
                  // Strategy to render number when the raw value is incorrect.
                  enableFallbackInput={true} // Default: true
                  error={errors.phone?.message}
                  formGroupClassName=''
                  formGroupStyle={{ marginBottom: 15 }}
                  formText={`Enter a ${getCountryNameFromCountryCode(country)} phone number.`}
                  formTextClassName=''
                  formTextStyle={{}}
                  id='national-version'
                  label='Phone Number:'
                  labelClassName='text-sm font-bold text-blue-500'
                  labelRequired
                  labelStyle={{}}
                  name='phone'
                  onBlur={onBlur}
                  onChange={(value) => {
                    onChange(value)
                  }}
                  placeholder='Phone Number...'
                  size='sm'
                  style={{}}
                  touched={touchedFields?.phone}
                  value={value}
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

        {renderPhone()}
      </Fragment>
    )
  }

  /* ======================
          return
  ====================== */

  return renderForm()
}
