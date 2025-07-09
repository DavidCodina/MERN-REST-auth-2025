import { Fragment, useEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { Check } from './'

const schema = z.object({
  cats: z.array(z.string()).min(1, 'At least one cat must be selected.')
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  cats: []
}

/* ========================================================================

======================================================================== */

export const CheckDemo = () => {
  const {
    register,
    reset,
    handleSubmit,
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
    console.log({ errors })
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

          <fieldset className='mb-4'>
            <legend className='mb-1 font-medium'>
              Select A Cat: <sup style={{ color: 'red' }}>*</sup>
            </legend>
            <Check
              error={errors?.cats?.message}
              id='cat-1'
              label='Muffy'
              ///////////////////////////////////////////////////////////////////////////
              //
              // Gotcha: {...register('cats')}
              //
              // react-hook-form types the value touchedFields?.cats as boolean[].
              // This happens because FormValues (correctly) types cats as string[],
              // but then when useForm<FormValues>, react-hook-form somehow incorrectly
              // infers that touchedFields?.cats will be boolean[].
              // But if you actually look at what it's doing, it's just a single boolean.
              // To get around this we can do:
              //
              //   touched={typeof touchedFields?.cats === 'boolean' ? touchedFields?.cats : undefined }
              //
              // Or typecast it as follows:
              //
              //   touched={touchedFields?.cats as unknown as boolean}
              //
              // Why is this happening? Often when one uses array in react-hook-form,
              // we break up registered values by doing:
              //
              //   {...register('cats.0')}
              //   {...register('cats.1')}
              //   {...register('cats.2')}
              //
              // That has the effect of splitting touchedFields.cats and errors.cats into
              // an array of parallel values. And if we were to do that, then the Typescript
              // thinking touchedFields?.cats was boolean[] would be true. However, that is NOT
              // what we want to do.
              //
              // This seems to be a case where react-hook-form's typings are a little buggy,
              // and we just need to deal with it.
              //
              ///////////////////////////////////////////////////////////////////////////

              touched={touchedFields?.cats as unknown as boolean}
              value='Muffy'
              // onClick={(e) => console.log((e.target as HTMLInputElement).checked)}
              {...register('cats')}
            />

            <Check
              error={errors?.cats?.message}
              id='cat-2'
              label='Gingerbread'
              touched={touchedFields?.cats as unknown as boolean}
              value='Gingerbread'
              {...register('cats')}
            />

            <Check
              error={errors?.cats?.message}
              // formText='Choose at least one.'
              id='cat-3'
              label='Punkin'
              showError
              touched={touchedFields?.cats as unknown as boolean}
              value='Punkin'
              {...register('cats')}
            />
          </fieldset>

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
