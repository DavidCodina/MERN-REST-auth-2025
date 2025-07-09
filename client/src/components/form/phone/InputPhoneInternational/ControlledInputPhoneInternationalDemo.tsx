import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  ComponentProps
} from 'react'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { InputPhoneInternational /* , CountryCode  */ } from './'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { sleep } from 'utils'

type CountryCode = ComponentProps<typeof InputPhoneInternational>['country']

/* ========================================================================
                        ControlledInputPhoneInternationalDemo
======================================================================== */

export const ControlledInputPhoneInternationalDemo = () => {
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const [phone, setPhone] = useState('') // '+441782830038' , '+12065554433'
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [phoneError, setPhoneError] = useState('')

  const [country, setCountry] = useState<CountryCode | ''>('')

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

      setCountry('')
      setPhoneTouched(false)
      setPhoneError('')
      setIsSubmitting(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('\nParent values:', { phone, country })
  }, [phone, country])

  // useEffect(() => {  if (phoneRef.current) { console.dir(phoneRef.current) }}, [])

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        <InputPhoneInternational
          ref={phoneRef}
          className=''
          countries={['US', 'CA', 'GB']}
          country={country} // Here we can still set a CountryCode that is not inclueded in countries.
          disabled={false}
          error={phoneError}
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
          name='international-version'
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
          // If you want a fully-controlled implementation of the associated country, you
          // can use onCountryChange. This may be useful for also capturing the country code
          // as a piece of data that can be both validated and sent to the server.
          // However, if you ONLY want to reset the country after sumbitting the form, you don't
          // need the full two-way binding. Instead, you can just call setCountry('') in the
          // submit handler. InputPhoneInternational is set up such that it has a useEffect() that
          // watches for changes to the country prop and updates the internalCountry accordingly.

          // onCountryChange={(country) => { setCountry(country) }}
          placeholder='Phone Number...'
          size='lg'
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

      <div className='mb-12 text-center text-3xl font-bold text-blue-500'>
        phone: {phone}
      </div>
    </>
  )
}
