// Third-party imports
import {
  Fragment,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef
} from 'react'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

// Custom imports
import { sleep } from 'utils'
import { InputNumber } from './'

/* ========================================================================
                              ControlledInputNumberDemo
======================================================================== */
// This is one of the most basic examples in that it doesn't implement react-hook-form or zod.

export const ControlledInputNumberDemo = () => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [number, setNumber] = useState('95')
  const [numberTouched, setNumberTouched] = useState(false)
  const [numberError, setNumberError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = numberError !== ''
  const allTouched = numberTouched

  /* ======================
      validateNumber()
  ====================== */

  const validateNumber = (value?: string) => {
    value = typeof value === 'string' ? value : number

    let error = ''

    // This is necesary because Number('') coerces to 0.
    if (typeof value !== 'string' || value.trim() === '') {
      error = 'Required.'
      setNumberError(error)
      return error
    }

    const valueNoCommas = value.replace(/,/g, '')

    const isNum = (v: any) => typeof v === 'number' && !isNaN(v)
    // Technically, value will still be a string, so what we really want to check is
    // if it can be transformed into a number. Here we're using Number() and not parseFloat().
    // Why? Because parseFloat() is more forgiving such that it will coerce '123abc' to 123.
    const valueIsNumeric = isNum(Number(valueNoCommas))

    if (!valueIsNumeric) {
      error = "That's not a number."
      setNumberError(error)
      return error
    }

    //^ If you're on 50.50, then delete the .5 part it doesn't trigger immediately.
    if (Number(valueNoCommas) === 50) {
      error = '50 is not allowed.'
      setNumberError(error)
      return error
    }

    //# Perform additional checks against the number version to see if it's in range, etc.

    // Otherwise unset the title error in state and return ''
    setNumberError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: Dispatch<SetStateAction<boolean>>[] = [setNumberTouched]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [validateNumber]

    validators.forEach((validator) => {
      const error = validator()
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

    const { isValid } = validate()

    if (!isValid) {
      return
    }

    const requestData = {
      number: number
    }

    try {
      // Make API request, etc.
      await sleep(1500)
      console.log('requestData:', requestData)
      toast.success('Form validation success!')
    } catch (err) {
      console.log(err)
      toast.error('Unable to submit the form!')
    } finally {
      setNumber('')

      if (formRef.current) {
        formRef.current?.reset()
      }

      setIsSubmitting(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('number state is now:', { number })
  }, [number])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <Fragment>
        <form
          className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
          ref={formRef}
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate // Not really needed, but doesn't hurt.
        >
          {/* =====================
       
          ===================== */}

          <InputNumber
            // allowNegative={false}
            // allowDecimal={false}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=','
            clampBehavior='strict' // Default: 'blur'
            className=''
            // defaultValue={number}
            error={numberError}
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            id='number'
            label='number:'
            labelClassName=''
            labelRequired
            labelStyle={{}}
            placeholder='Number...'
            size='sm'
            style={{}}
            touched={numberTouched}
            min={-10}
            max={1000}
            name='my_number_input'
            onBlur={(e) => {
              if (!numberTouched) {
                setNumberTouched(true)
              }
              validateNumber(e.target.value)
            }}
            onChange={(e) => {
              setNumber(e.target.value)

              if (numberTouched) {
                validateNumber(e.target.value)
              }
            }}
            // defaultValue={defaultValue}
            value={number}
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

  /* ======================
          return 
  ====================== */

  return renderForm()
}
