import { Fragment, useEffect, useLayoutEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { InputNumber } from './'

const schema = z.object({
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
    .regex(/^-?(0|0\..*|[1-9].*)?$/, 'Leading zeros are not allowed.')

    // Just for demo, prohibit 50.
    .regex(/^(?!50(\.|$)).*/, '50 is not allowed.')
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  number: '99'
}

/* ========================================================================
                         
======================================================================== */

export const RHF_InputNumberDemo = () => {
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    watch,
    // control,
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

  const { onChange, ...otherRegisterProps } = register('number')

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

          <InputNumber
            // allowNegative={false}
            // allowDecimal={false}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=','
            clampBehavior='strict'
            className=''
            error={errors?.number?.message}
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
            touched={touchedFields?.number}
            // min={-1}
            // max={101}
            {...otherRegisterProps}
            onChange={(e) => {
              // console.log('number onChange:', e.target.value)
              onChange(e)
            }}
            // InputNumber uses value | defaultValue | '' to initialize its internal
            // formattedValue state. Normally when usinng react-hook-form, you don't
            // need to pass in a defaultValue prop because when  you spread ...register(),
            // the RHF ref() function will assign the default value by setting the value
            // directly on the DOM input's .value property. However, InputNumber is actually
            // overwriting this process with the formattedValue, which is why we need to manually
            // pass in a defaultValue prop for the uncontrolled implementation.
            defaultValue={defaultValues.number}
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
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}
