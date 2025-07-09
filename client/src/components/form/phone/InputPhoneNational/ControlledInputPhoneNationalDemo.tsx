import {
  ComponentProps,
  Dispatch,
  SetStateAction,
  Fragment,
  useState,
  useEffect,
  useRef
} from 'react'
import { getCountryCallingCode } from 'react-phone-number-input'
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

const country: CountryCode = 'GB'
const countryCallingCode = getCountryCallingCode(country)

///////////////////////////////////////////////////////////////////////////
//
// Clean and prepare the value prior to setting it in state.
// This ensures that we don't have to rely on the fallback input.
// Note: this approach is ONLY used for numbers that we know
// for sure are intended to be within the the 'US' country.
//
// This approach would be naive for some other countries.
// For example, a UK number might be '01782 80038', but preparing it in
// this way would result in '+440178280038', which is still incorrect
// because for international calls E.164 format omits the '0' for 'GB' numbers.
//
// Ultimately, if are concerned about received values not being in E.164 format,
// then the best place to handle that is on the server. We could do a
// a bulk update of the database values and/or have a PATCH endpoint that
// also cleans and prepares values prior to changing them in the database.
// Of course, those solutions would also need to understand the nuances of
// the country's E.164 format.
//
///////////////////////////////////////////////////////////////////////////

const _cleanPhoneNumber = (value: string) => {
  return value.replace(/[^0-9+]/g, '')
}

const _prepareUSPhoneNumber = (value: string) => {
  if (value.startsWith('1')) {
    value = `+${value}`
  } else if (value.trim().length > 0 && !value.startsWith('+1')) {
    value = `+${countryCallingCode}${value}`
  }
  return value
}

const _getData = async () => {
  await sleep(3000)

  return {
    data: {
      // The value here is intentionally not E.164 format
      // to demonstrate the use of the fallback input and/or
      // the cleaning/preparing functions.
      phone: '01782 830038' //  '206-555-4433'
    },
    message: 'Success.',
    success: true
  }
}

/* ========================================================================
                    ControlledInputPhoneNationalDemo 
======================================================================== */

export const ControlledInputPhoneNationalDemo = () => {
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const [phone, setPhone] = useState('+441782830038')

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
      setPhone('')
      setPhoneTouched(false)
      setPhoneError('')
      setIsSubmitting(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  // useEffect(() => {
  //   getData()
  //     .then((json) => {
  //       const { success, data } = json
  //       if (success === true && typeof data?.phone === 'string') {
  //         const cleanedPhoneNumber = cleanPhoneNumber(json.data.phone)
  //         const preparedUSPhoneNumber = prepareUSPhoneNumber(cleanedPhoneNumber)
  //         setPhone(preparedUSPhoneNumber)
  //       }
  //       return json
  //     })
  //     .catch((err) => err)
  // }, [])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('phone is now:', phone)
  }, [phone])

  // useEffect(() => { if (phoneRef.current) { console.dir(phoneRef.current) } }, [])

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
          id='national-version'
          label='Phone Number:'
          labelClassName='text-sm font-bold text-blue-500'
          labelRequired
          labelStyle={{}}
          name='national-version'
          onBlur={async () => {
            await validatePhone()

            if (!phoneTouched) {
              setPhoneTouched(true)
            }

            // ✅ console.dir(e.target)
            // ❌ console.log(e.target)
          }}
          onChange={(value) => {
            setPhone(value)

            if (phoneTouched) {
              validatePhone(value)
            }
          }}
          placeholder='Phone Number...'
          size='sm'
          style={{}}
          touched={phoneTouched}
          value={phone}
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

      <div className='mb-12 text-center text-3xl font-bold text-blue-500'>
        phone: {phone}
      </div>
    </Fragment>
  )
}
