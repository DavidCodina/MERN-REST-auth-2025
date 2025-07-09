import { Fragment, useState, Dispatch, SetStateAction, useRef } from 'react'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { InputNumber, NumberFormatValues } from './'

/* ========================================================================
                          ControlledInputNumberDemo
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/s-yadav/react-number-format/issues/229
//^ Internally, react-number-format's NumericFormat component is a controlled input!
// In other words, NumericFormat manages its own internal state and the value displayed in
// the input IS CONTROLLED. This means that normal approaches to reset a form through
// uncontrolled implementations won't work - formRef.current?.reset().
//
// You can get pretty far without needing to pass in a value prop. However, once you try to clear the
// form you're out of luck. This point isn't really made clear in the docs. Moral of the story: InputNumber
// should almost always be controlled - especially if you're using react-hook-form!!!
//
///////////////////////////////////////////////////////////////////////////

export const ControlledInputNumberDemo = () => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [values, setValues] = useState<NumberFormatValues>({
    floatValue: -1.0,
    formattedValue: '-1.00',
    value: '-1.00'
  })

  const [numberTouched, setNumberTouched] = useState(false)
  const [numberError, setNumberError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = numberError !== ''
  const allTouched = numberTouched

  const min = -10
  const max = 10

  /* ======================
      validateNumber()
  ====================== */

  const validateNumber = async (numberFormatValues?: NumberFormatValues) => {
    await sleep(250)
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

    ///////////////////////////////////////////////////////////////////////////
    //
    // Check that the value is within the min/max range...
    // We know that if value is not '', then floatValue will be a number,
    // but Typescript still needs assurance. Set clampBehavior='none' to
    // test this. Note: if clampBehavior='blur', then there will be a
    // slight flicker on blur as the UI shows the error, then the component
    // clamps it and the error is removed. To mitigate the flicker, set a delay
    // at the top of the validation function.
    //
    // The flipside of this is that you can end up with green isValid UI after touched
    // but before the validation completes. To mitigate this in the onBlur handler, you
    // need to await the completed vallidation before setting touched to true:
    //
    //   onBlur={async () => {
    //     await validateNumber(values)
    //     if (!numberTouched){ setNumberTouched(true)}
    //   }}
    //
    ///////////////////////////////////////////////////////////////////////////

    if (
      typeof min === 'number' &&
      typeof floatValue === 'number' &&
      floatValue < min
    ) {
      error = `The value must not be lower than ${min}.`
      setNumberError(error)
      return error
    }

    if (
      typeof max === 'number' &&
      typeof floatValue === 'number' &&
      floatValue > max
    ) {
      error = `The value must not be higher than ${max}.`
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

  const validate = async () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: Dispatch<SetStateAction<boolean>>[] = [setNumberTouched]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: ((...args: any[]) => string | Promise<string>)[] = [
      validateNumber
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

      setValues({
        floatValue: undefined,
        formattedValue: '',
        value: ''
      })

      setIsSubmitting(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mb-6 flex justify-center gap-4'>
        <button
          className='btn-blue'
          onClick={() => {
            setValues((prev) => {
              const value =
                prev.value !== ''
                  ? (parseFloat(prev.value) - 1).toString()
                  : '-1'
              return {
                ...prev,
                value
              }
            })
          }}
        >
          Decrement
        </button>

        <button
          className='btn-blue'
          onClick={() => {
            setValues((prev) => {
              const value =
                prev.value !== ''
                  ? (parseFloat(prev.value) + 1).toString()
                  : '1'
              return {
                ...prev,
                value
              }
            })
          }}
        >
          Increment
        </button>
      </div>
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
          max={max}
          min={min}
          name='my_number_input'
          onBlur={async () => {
            await validateNumber(values)

            if (!numberTouched) {
              setNumberTouched(true)
            }
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
          // prefix='$'//prefix='MONEY: '
          prependZero={true}
          ref={inputRef} //# Test a function ref...
          size='sm'
          style={{}}
          // suffix=' USD'
          thousandSeparator
          touched={numberTouched}
          value={values.value}
          withKeyboardEvents={true}
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

      <div className='text-center text-3xl font-black text-blue-500'>
        values.value: {values.value}
      </div>
    </>
  )
}
