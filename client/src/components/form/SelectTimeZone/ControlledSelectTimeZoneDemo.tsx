import {
  Dispatch,
  SetStateAction,
  Fragment,
  useState,
  useEffect,
  useRef
} from 'react'
import { SelectTimeZone, DefaultTimezone } from './.'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'

type _MaybeTimezone = DefaultTimezone | ''

// https://github.com/ndom91/react-timezone-select/tree/main?tab=readme-ov-file#-default-users-timezone
// I'm not sure how Next.js will behave beetwen client/server components. It might cause a rehydation error in some cases.
//` const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone // e.g., 'America/Denver'
const initialTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '' // e.g., 'America/Denver'

const americanTimezones = {
  'America/Juneau': 'Alaska',
  'America/Boise': 'Mountain Time',
  'America/Dawson': 'Dawson, Yukon',
  'America/Chihuahua': 'Chihuahua, La Paz, Mazatlan',
  'America/Phoenix': 'Arizona',
  'America/Chicago': 'Central Time',
  'America/Regina': 'Saskatchewan',
  'America/Mexico_City': 'Guadalajara, Mexico City, Monterrey',
  'America/Belize': 'Central America',
  'America/Detroit': 'Eastern Time',
  'America/Bogota': 'Bogota, Lima, Quito',
  'America/Caracas': 'Caracas, La Paz',
  'America/Santiago': 'Santiago',
  'America/St_Johns': 'Newfoundland and Labrador',
  'America/Sao_Paulo': 'Brasilia',
  'America/Tijuana': 'Tijuana',
  'America/Montevideo': 'Montevideo',
  'America/Argentina/Buenos_Aires': 'Buenos Aires, Georgetown',
  'America/Godthab': 'Greenland',
  'America/Los_Angeles': 'Pacific Time'
} as const

/* ========================================================================

======================================================================== */

export const ControlledSelectTimeZoneDemo = () => {
  const selectTimeZoneRef = useRef<HTMLSelectElement | null>(null)

  // Here we could use MaybeTimezone to restrict all usage to only those timezones
  // within allTimezones.ts. However, I prefer to be a little more flexible.
  // By allowing useState to simply infer a string, we can allow for other valid
  // timezones that are not explicitly in the allTimezones dictionary. Then
  // we can use the onMount() callback to immediately transform the value to an
  // equivalent timezone within alltimezones.
  const [timezone, setTimezone] = useState('')
  const [timezoneTouched, setTimezoneTouched] = useState(false)
  const [timezoneError, setTimezoneError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = timezoneError !== ''
  const allTouched = timezoneTouched

  /* ======================
      validateSelect()
  ====================== */

  const validateSelect = (value?: string) => {
    value = typeof value !== 'undefined' ? value : timezone

    if (!value) {
      setTimezoneError('Selection required.')
      return 'Selection required.'
    }

    setTimezoneError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = async () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: Dispatch<SetStateAction<boolean>>[] = [setTimezoneTouched]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: ((...args: any[]) => string | Promise<string>)[] = [
      validateSelect
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

    const requestData = { timezone }

    try {
      // Make API request, etc.
      await sleep(1500)
      console.log('requestData:', requestData)
      toast.success('Form validation success!')
    } catch (err) {
      console.log(err)
      toast.error('Unable to submit the form!')
    } finally {
      setTimezone('')
      setTimezoneTouched(false)
      setTimezoneError('')
      setIsSubmitting(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('timezone is now:', timezone)
  }, [timezone])

  /* ======================
        useEffect()
  ====================== */
  // Simulate an async initial value that is NOT in the timezones dictionary.

  useEffect(() => {
    setTimeout(() => {
      setTimezone(initialTimezone)
    }, 2000)
  }, [])

  /* ======================
        useEffect()
  ====================== */

  // useEffect(() => {
  //   if (!selectTimeZoneRef.current) { return }
  //   console.dir(selectTimeZoneRef.current)
  // }, [])

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
        <SelectTimeZone
          ref={selectTimeZoneRef}
          // displayValue='UTC'
          // timezoneLabelStyle='offsetHidden'
          error={timezoneError}
          formGroupClassName='mb-4'
          formGroupStyle={{
            maxWidth: 800
          }}
          timezones={americanTimezones}
          id='timezone'
          label='Time Zone'
          labelRequired
          name='timezone'
          placeholder='Time Zone...' // Becomes the <option value=''>{placeholder}</option>
          size='sm'
          style={{}}
          ///////////////////////////////////////////////////////////////////////////
          //
          // With Zod you want to set the defaultValue from the defaultValues object.
          // Presumably, register() takes the name value and updates e.target.value when mounting.
          // With a normal react-hook-form implementation setting defaultValue here wouldn't be necesary.
          // However, the SelectTimeZone component is set up to add the defaultValue to it's timezones Record
          // only when the defaultValue prop is passed. If not for this, SelectTimeZone would have no way
          // of knowing if it should add the additional timezone to the list.
          //
          ///////////////////////////////////////////////////////////////////////////
          //` defaultValue={defaultTimezone}
          value={timezone}
          touched={timezoneTouched}
          onBlur={async (_e) => {
            await validateSelect()

            if (!timezoneTouched) {
              setTimezoneTouched(true)
            }
            // ✅ console.dir(e.target)
            // ❌ console.log(e.target)
          }}
          onChange={(e) => {
            setTimezone(e.target.value)
            if (timezoneTouched) {
              validateSelect(e.target.value)
            }
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

      <pre className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4'>
        {JSON.stringify(timezone, null, 2)}
      </pre>
    </>
  )
}
