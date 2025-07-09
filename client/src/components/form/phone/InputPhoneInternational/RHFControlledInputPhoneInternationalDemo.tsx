import { useEffect, useLayoutEffect, useRef } from 'react'
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

import { InputPhoneInternational, CountryCode } from './'
import { sleep } from 'utils'

// This version allows undefined, whereas the one from './' does not.
// type CountryCode = ComponentProps<typeof InputPhoneInternational>['country']

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
    ),

  country: z.string().min(1, 'The country is required.')
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  phone: '', // '+441782830038'
  country: '' as CountryCode
}

/* ========================================================================
                        RHFControlledInputPhoneInternationalDemo
======================================================================== */
// react-phone-number-input has components that integrate with react-hook-form:
// https://gitlab.com/catamphetamine/react-phone-number-input#react-hook-form
// However, I'm not going to have a separate implementation just for react-hook-form.
// We can still use react-hook-form's Controller.

export const RHFControlledInputPhoneInternationalDemo = () => {
  const resetRef = useRef(false)
  const {
    // register,
    reset,

    handleSubmit,
    getValues,
    setValue,
    // setError,
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

    await sleep(1500) // await API call
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

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      // This will reset country and the associated error, but there's a gotcha!
      // When you call reset() here it will actually trigger the onCountryChange() handler
      // again. Consequently, we need to temporarily disable it prior to calling reset().
      resetRef.current = true
      reset({ phone: '', country: '' })

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
        renderValues()
  ====================== */

  const renderValues = () => {
    const values = watch()
    return (
      <div className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4 text-sm shadow'>
        <div className='mb-1 text-sm font-bold text-blue-500'>Values:</div>
        <pre className='m-0'>{JSON.stringify(values, null, 2)}</pre>
        <br />
        <div className='mb-1 text-sm font-bold text-blue-500'>Errors:</div>
        <pre className='m-0'>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    )
  }

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <>
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
              const country = getValues('country') as CountryCode | ''

              return (
                <InputPhoneInternational
                  ref={inputRef}
                  className=''
                  countries={['US', 'CA', 'GB']}
                  country={country}
                  disabled={disabled}
                  error={errors.phone?.message || errors.country?.message}
                  formGroupClassName=''
                  formGroupStyle={{ marginBottom: 15 }}
                  formText='Select a country and enter a phone number.'
                  formTextClassName=''
                  formTextStyle={{}}
                  id='international-version'
                  label='Phone Number:'
                  labelClassName='text-sm font-bold text-blue-500'
                  labelRequired
                  labelStyle={{}}
                  name='phone'
                  onBlur={onBlur}
                  onChange={(value) => {
                    onChange(value)
                  }}
                  onCountryChange={(country) => {
                    if (resetRef.current === true) {
                      resetRef.current = false
                      return
                    }
                    setValue('country', country, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true
                    })
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
                <>
                  <TriangleAlert className='pointer-events-none size-[1.25em]' />{' '}
                  Please Fix Errors...
                </>
              ) : (
                'Submit'
              )}
            </button>
          )}
        </form>

        {renderValues()}
      </>
    )
  }

  /* ======================
          return
  ====================== */

  return renderForm()
}
