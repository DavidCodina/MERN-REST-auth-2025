import {
  ComponentProps,
  Dispatch,
  SetStateAction,
  Fragment,
  useState,
  useRef
} from 'react'
import { toast } from 'react-toastify'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { TriangleAlert } from 'lucide-react'

import {
  InputPhoneNational,
  getCountryNameFromCountryCode
  // CountryCode
} from './'
import { sleep } from 'utils'

type CountryCode = ComponentProps<typeof InputPhoneNational>['country']

const country: CountryCode = 'US'

/* ========================================================================
                      UncontrolledInputPhoneNationalDemo
======================================================================== */

export const UncontrolledInputPhoneNationalDemo = () => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Gotcha:
  //
  // For uncontrolled implementations, you may be tempted to use:
  //
  //   phoneRef.current?.value || ''
  //
  // However, that's a bad idea because that value is always formatted.
  // For example, we might be looking for '+12065554433' but will get
  // '(206) 555-4433'.
  //
  // So even here we use phone state. The main difference between this implementation
  // and the controlled version is that we're not passing phone back into the value prop.
  // However, the defaultValue is actually merged with the value prop internally, which
  // means that this is actually a controlled implementation also.
  //
  // TL;DR: As a demo, this was a useful experiment, but I would recommend ALWAYS
  // sticking to the controlled implementation, since even the uncontrolled version
  // is technically controlled.
  //
  ///////////////////////////////////////////////////////////////////////////

  const [phone, setPhone] = useState('+12065554433')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = phoneError !== ''
  const allTouched = phoneTouched

  /* ======================
        validatePhone
  ====================== */
  // The handleSubmit() uses the return string value, and passes no arg.
  // The onChange() and onBlur() use the phoneError state and pass the
  // new value directly as an arg in order to avoid a race condition.
  // phoneError state is also important for setting any possible validation
  // errors that come back from a server.

  const validatePhone = (value?: string) => {
    const phone = phoneRef.current?.value || ''
    value = typeof value === 'string' ? value : phone

    if (typeof value === 'string' && value.trim() === '') {
      setPhoneError('A phone number is required.')
      return 'A phone number is required.'
    }

    // We could do this, but it may not be a good idea if you're validating an edit form.
    // Why? Because it's possible that the number technicallly looks correct in the UI.
    // (e.g., '01782 830038' or '(206) 555-4433'), but are actually using the fallback input,
    // so the value is not in E.164 format. For now, I've left it in, but be aware that this
    // is potentially a bad idea for edit forms.
    if (!isValidPhoneNumber(value)) {
      setPhoneError('The number is invalid.')
      return 'The number is invalid.'
    }

    setPhoneError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = async () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: Dispatch<SetStateAction<boolean>>[] = [setPhoneTouched]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: ((...args: any[]) => string | Promise<string>)[] = [
      validatePhone
    ]

    const validationResults = await Promise.all(
      validators.map((validator) => validator())
    )

    validationResults.forEach((error) => {
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      // console.log('Returning early from handleSubmit() because of errors.', errors)
      toast.error('Form validation errors found.')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)

    const { isValid } = await validate()
    if (!isValid) {
      return
    }

    const requestData = { phone }

    try {
      // Make API request, etc.
      await sleep(1500)
      console.log('requestData:', requestData)
      toast.success('Form validation success!')
    } catch (err) {
      console.log(err)
      toast.error('Unable to submit the form!')
    } finally {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ❌  formRef.current?.reset()
      //
      // Using formRef.current?.reset() won't work.
      // Presumably because when the value is passed to the internal
      // react-phone-number-input component, then that component manages the value
      // internally through state. InputPhoneNational does this at the top of the component:
      //
      //   value = value || defaultValue || ''
      //
      // Then value is passed directly into react-phone-number-input's value prop.
      // In practice this means we can still change the defaultValue at any point
      // because technically it's the value prop that we are updating.
      //
      // Update: InputPhoneNational now has its own internalValue state, but
      // that doesn't change the way that react-phone-number-input behaves.
      //
      // The implementation here is sort of a quasi-uncontrolled version.
      // We're not using the onChange() to update phone state on every change.
      // This could be considered an optimization. However, once we've blurred on
      // the input, we are actually validating on every change, which then sets
      // phoneError state. In fact, for a production version we may choose to
      // omit the defaultValue prop from the types to prevent developers from
      // trying to do this at all.
      //
      ///////////////////////////////////////////////////////////////////////////
      setPhone('')

      setPhoneTouched(false)
      setPhoneError('')
      setIsSubmitting(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <form
        className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
        ref={formRef}
      >
        <InputPhoneNational
          ref={phoneRef}
          className=''
          country={country} // Default: 'US'
          disabled={false}
          // Strategy to render number when the raw value is incorrect.
          enableFallbackInput={true} // Default: true
          error={phoneError}
          formGroupClassName=''
          formGroupStyle={{ marginBottom: 15 }}
          formText={`Enter a ${getCountryNameFromCountryCode(country)} phone number.`}
          formTextClassName=''
          formTextStyle={{}}
          id='phone'
          label='Phone Number:'
          labelClassName='text-sm font-bold text-blue-500'
          labelRequired
          labelStyle={{}}
          name='phone'
          onBlur={async () => {
            await validatePhone()

            if (!phoneTouched) {
              setPhoneTouched(true)
            }

            // ✅ console.dir(e.target)
            // ❌ console.log(e.target)
          }}
          onChange={(value) => {
            console.log('Parent onChange value:', value)
            if (phoneTouched) {
              validatePhone(value)
            }
          }}
          placeholder='Phone Number...'
          size='sm'
          style={{}}
          touched={phoneTouched}
          defaultValue={phone}
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
            disabled={allTouched && isErrors ? true : false}
            onClick={handleSubmit}
            type='button'
          >
            {allTouched && isErrors ? (
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
