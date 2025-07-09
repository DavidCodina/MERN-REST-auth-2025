import { Fragment, useEffect, useLayoutEffect } from 'react'
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
import { InputNumber } from './'

const schema = z.object({
  //# This is validating against the values.value from the InputNumber component.
  //# However, it probably makes more sense to use the values.formattedValue in mose cases.
  number: z
    .string()
    // Basic string validation - invalidate if ''
    .min(1, 'Required.')

    .regex(/^[-0-9.,]+$/, 'Invalid character.')

    ///////////////////////////////////////////////////////////////////////////
    //
    // This regex specifally prohibits leading zeros.
    // InputNumber also prevents leading zeros, so to truly see this in action,
    // you would need to comment out logic in formatNumber()
    // Allow only the following:
    //
    //   '0' or '-0'
    //   '0.' or '-0.' followed by anything
    //   '1'-'9' or '-' and '1'-'9' followed by anything
    //
    // It allows allows '-' to exist without anything else after it.
    // This prevents the user from getting weird errors while still typing.
    // However, the InputNumber itself corrects this onBlur.
    // Don't try to do too many things in any one regex.
    // This regex assumes that there is no prefix (e.g., '$').
    //
    ///////////////////////////////////////////////////////////////////////////

    .regex(/^-?(0|0\..*|[1-9].*|\..*)?$/, 'Leading zeros are not allowed.')

    // Just for demo, prohibit 50.
    .regex(/^(?!50(\.|$)).*/, '50 is not allowed.')
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  number: '1.25'
}

/* ========================================================================
                         
======================================================================== */

export const RHF_ControlledInputNumberDemo = () => {
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

  const min = -10
  const max = 10

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
      reset({ number: '' }, {})
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
      console.log('watched number:', { number: values.number })
    })
    return () => subscription.unsubscribe()
  }, [watch])

  /* ======================
        renderNumber()
  ====================== */

  const renderNumber = () => {
    const number = watch('number')
    return (
      <div className='text-center text-3xl font-black text-blue-500'>
        number (values.value): {number}
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
            name='number'
            render={({ field }) => {
              const { onChange, onBlur, value, ref: inputRef, disabled } = field

              return (
                <InputNumber
                  allowDecimal={true}
                  // allowedDecimalSeparators={['%']}
                  allowLeadingZeros={true}
                  aria-label='My number input'
                  //callOnValueChangeOnMount={true}
                  clampBehavior='blur'
                  className=''
                  data-testid='my_number_input'
                  decimalScale={2}
                  // decimalSeparator='x' allow user to type 'x', or '.' such that typing '.' renders 'x'.
                  // Aslo a defaultValue of '10.00' will be converted to '10x00'.
                  decimalSeparator='.'
                  disabled={disabled}
                  error={errors.number?.message}
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
                  onBlur={onBlur}
                  onChange={(_e) => {
                    // Here e.target.value will be most similar to the formattedValue.
                    // That said, e.target.value is not guaranteed to be exactly the same as formattedValue.
                  }}
                  onValueChange={(values, _sourceInfo) => {
                    console.log(
                      '\nonValueChange called in consuming component...',
                      values
                    )

                    // This is important part: Take the RHF onChange() and pass it all or part of
                    // the values object.
                    //
                    onChange(values.value)

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
                  thousandSeparator=','
                  touched={touchedFields?.number}
                  value={value}
                  withKeyboardEvents={true}
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

        {renderNumber()}
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}
