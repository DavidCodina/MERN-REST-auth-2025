import { Fragment, useEffect, useRef } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { Select } from './'

const schema = z.object({
  // The gender field begins as an empty string.
  // Because it's a <select> we generally only need to check if a value
  // was selected. If you really wanted to lock it down, you could go a
  // step further with a regex that only allows the specific values
  // associated to each option.
  gender: z.string().min(1, 'Required.')
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  gender: ''
}

/* ========================================================================

======================================================================== */

export const SelectDemo = () => {
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    // watch,
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

    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field components
    // are designed to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  const { ref: rhfRef, ...otherRegisterProps } = register('gender')

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
    console.log({ errors, values })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})
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
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    console.log('\nselectRef.current:')
    console.dir(selectRef.current)
  }, [])

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

          <Select
            error={errors?.gender?.message}
            formGroupClassName='mb-4'
            id='gender'
            label='Gender'
            labelRequired
            size='sm'
            touched={touchedFields?.gender}
            ref={(node) => {
              rhfRef(node)
              selectRef.current = node
            }}
            {...otherRegisterProps}
          >
            <option value=''></option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Select>

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
              // You could also add || !isDirty. In the case of an update form,
              // it still makes sense because there's no need to send an update if
              // nothing's actually been updated.
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
