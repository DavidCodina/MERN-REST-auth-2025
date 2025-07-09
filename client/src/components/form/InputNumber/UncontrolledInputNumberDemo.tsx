import {
  Fragment,
  useLayoutEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef
} from 'react'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { InputNumber, NumberFormatValues } from './'

/* ========================================================================
                         UncontrolledInputNumberDemo
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/s-yadav/react-number-format/issues/229
//! Internally, react-number-format's NumericFormat component is a controlled input!
// In other words, NumericFormat manages its own internal state and the value displayed in
// the input IS CONTROLLED. This means that normal approaches to reset a form through
// uncontrolled implementations won't work - formRef.current?.reset().
//
// You can get pretty far without needing to pass in a value prop. However, once you try to clear the
// form you're out of luck. This point isn't really made clear in the docs. Moral of the story: InputNumber
// should almost always be controlled - especially if you're using react-hook-form!!!
//
// That said, there are still some hacks you can do to get around this limitation.
// I'm not recommending it, but you can always unmount/remount the component
// - as is done in this example.
//
///////////////////////////////////////////////////////////////////////////

export const UncontrolledInputNumberDemo = () => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [values, setValues] = useState<NumberFormatValues>({
    floatValue: 1.25,
    formattedValue: '1.25',
    value: '1.25'
  })

  const [numberTouched, setNumberTouched] = useState(false)
  const [numberError, setNumberError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = numberError !== ''
  const allTouched = numberTouched
  const [showInputNumber, setShowInputNumber] = useState(true)

  /* ======================
      validateNumber()
  ====================== */

  const validateNumber = (numberFormatValues?: NumberFormatValues) => {
    numberFormatValues =
      numberFormatValues && typeof numberFormatValues === 'object'
        ? numberFormatValues
        : values

    let error = ''

    // Here we can validate against any of the three properties in numberFormatValues.
    const value = numberFormatValues?.value
    const _formattedValue = numberFormatValues?.formattedValue
    const floatValue = numberFormatValues?.floatValue

    if (typeof value !== 'string' || value.trim() === '') {
      error = 'Required.'
      setNumberError(error)
      return error
    }

    // The relies on the fact that if value is not '', then floatValue will be a number.
    // It's an implicit way of testing that value.
    const isNum = (v: any) => typeof v === 'number' && !isNaN(v)
    const floatValueIsNumeric = isNum(floatValue)
    if (!floatValueIsNumeric) {
      error = "That's not a number."
      setNumberError(error)
      return error
    }

    // Prohibit '50' just because...
    if (['50', '50.', '50.0', '50.00'].indexOf(value) !== -1) {
      error = '50 is not allowed.'
      setNumberError(error)
      return error
    }

    // Prohibit leading zeros.
    // In practice, this shouldn't happen if you let allowLeadingZeros default to false.
    // However, the component is set up so that you can actually paste in a value with
    // leading zeros.

    const regex = /^-?0[0-9]+(\..*)?$/
    const hasLeadingZeros = regex.test(value)
    if (hasLeadingZeros) {
      error = 'Leading zeros are not allowed.'
      setNumberError(error)
      return error
    }

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

    const validators: ((...args: any[]) => string)[] = [validateNumber]

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

    //# Validate that the value is not greater than 1500, or less than...

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
    const requestData = { values }

    try {
      // Make API request, etc.
      await sleep(1500)
      console.log('requestData:', requestData)
      toast.success('Form validation success!')
    } catch (err) {
      console.log(err)
      toast.error('Unable to submit the form!')
    } finally {
      setValues({
        floatValue: undefined,
        formattedValue: '',
        value: ''
      })
      setNumberTouched(false)
      setNumberError('')

      if (formRef.current) {
        setShowInputNumber(false)
        // ❌ formRef.current?.reset()
      }

      setIsSubmitting(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  useLayoutEffect(() => {
    if (showInputNumber === false) {
      setShowInputNumber(true)
    }
  }, [showInputNumber])

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        ref={formRef}
        className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        {/* =====================
       
        ===================== */}

        {showInputNumber && (
          <InputNumber
            allowDecimal={true}
            // allowedDecimalSeparators={['%']}
            allowLeadingZeros={true}
            aria-label='My number input'
            callOnValueChangeOnMount={false}
            clampBehavior='blur'
            className=''
            data-testid='my_number_input'
            decimalScale={2}
            // decimalSeparator='x' allow user to type 'x', or '.' such that typing '.' renders 'x'.
            // Aslo a defaultValue of '10.00' will be converted to '10x00'.
            decimalSeparator='.'
            defaultValue={values.value}
            disabled={false}
            error={numberError}
            fixedDecimalScale
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            hideControls={false}
            id='my-number-input'
            label={'Number'}
            labelClassName='text-blue-500 font-bold'
            labelRequired
            labelStyle={{}}
            max={100}
            min={-100}
            name='my_number_input'
            onBlur={() => {
              if (!numberTouched) {
                setNumberTouched(true)
              }
              validateNumber(values)
            }}
            onChange={(_e) => {
              // Here e.target.value will be the formattedValue, not the values.value of onValueChange.
              // console.log('\nonChange called in consuming component...')
            }}
            onValueChange={(values, _sourceInfo) => {
              console.log(
                '\nonValueChange called in consuming component...',
                values
              )

              setValues(values)
              if (numberTouched) {
                validateNumber(values)
              }

              ///////////////////////////////////////////////////////////////////////////
              //
              // Gotcha: If you console.log(sourceInfo), it's likely that you'll see
              // a Warning:
              //
              //   VM51815:1 Warning: input: `ref` is not a prop. Trying to access it will result in `undefined` being returned.
              //   If you need to access the same value within the child component, you should pass it as a different prop.
              //
              // This has somethign to do with console.log()'s inabiilty to stringify the ref.
              // It's not an actual issue with the code.
              //
              // This is probably similar to how in React you can't do this:
              //
              //    console.log(internalRef.current)
              //
              // It would end up giving you a the following warning:
              //
              //   Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?
              //
              ///////////////////////////////////////////////////////////////////////////
            }}
            placeholder='Enter a number...'
            // prefix='$'
            prependZero={true}
            ref={inputRef} //# Test a function ref...
            size='sm'
            style={{}}
            // suffix=' USD'
            thousandSeparator
            touched={numberTouched}
            withKeyboardEvents={true}
          />
        )}

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

      <div className='text-center text-3xl font-black text-blue-500'>
        values.value: {values.value}
      </div>
    </>
  )
}
