import { Fragment, useEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { InputFile } from './'

const schema = z.object({
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://github.com/colinhacks/zod/issues/387
  //
  // z.any() by itself seems to cause a Typescript error
  // for InputFile's: error={errors?.fileList?.message}
  // That's why (z.any() as ZodType<FileList>) was used.
  // Additionally, we need to allow for '' and thus .or(z.literal(''))
  //
  // But actually, instead of (z.any() as ZodType<FileList>) we can now
  // use z.custom<FileList>(), but make sure to pass in validation and a message.
  //
  // See here for more info: https://zod.dev/?id=custom-schemas
  //
  ///////////////////////////////////////////////////////////////////////////

  fileList: z
    .custom<FileList | ''>(
      (value) => {
        if (
          !value ||
          !(value instanceof FileList) ||
          typeof value === 'string'
        ) {
          return false
        }

        if (value.length === 0) {
          return false
        }

        return true
      },
      {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Gotcha: By default, returning false/undefined in the above function will
        // cause any .refine() methods OUTSIDE of the top-level z.object() to not run.
        //
        // This actually makes sense. Think about a simple z.string().nonempty().
        // If there is no string at all, then there's no reason to call nonempty().
        // So, what we need is a way to make the final .refine() functions always run.
        // The actual solution is to make this non-fatal. This should be done for ALL
        // z.custom() implementations.
        //
        ///////////////////////////////////////////////////////////////////////////
        fatal: false,
        message: 'Please select a file.'
      }
    )

    ///////////////////////////////////////////////////////////////////////////
    //
    // I was using .or(z.literal('')), but found that the above .custom<FileList>()
    // wasn't actually catching empty strings. This actually happens because we are
    // specifically saying that strings are okay here.
    //
    // The solution is to either omit the string part entirely, then typecast
    // defaultValues with:
    //
    //   fileList: '' as unknown as FileList,
    //
    // Alternatively, we can create a validation that will fail for default empty string ''.
    // In this way, we're allowing strings, but the only string that will every show up
    // will be invalid.
    //
    //   .or(z.string().nonempty('Please select a file.'))
    //
    // But actually the best way to do this is:
    //
    //   .custom<FileList | ''>()
    //
    ///////////////////////////////////////////////////////////////////////////

    .refine(
      (value) => {
        const allowedValues = ['image/png', 'image/jpeg', 'image/jpg']

        // A helper to check file.type agains allowedValues.
        const isOneOf = (value: any, allowedValues: any[]) => {
          if (allowedValues.indexOf(value) !== -1) {
            return true
          }
          return false
        }

        // Double check that it's a FileList...
        if (!(value instanceof FileList)) {
          return false
        }

        // Validate against each file in FileList.
        for (let i = 0; i < value.length; i++) {
          const file = value[i]

          // This should really never happen, but it doesn't hurt.
          if (!file || !(file instanceof File)) {
            return false
          }

          // Despite already having an accept attribute on the input,
          // it's a good idea to manually check file types, etc.
          const isAllowedFileType = isOneOf(file.type, allowedValues)

          if (!isAllowedFileType) {
            return false
          }
        }

        return true
      },
      {
        message: 'Invalid file type.'
      }
    )
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  fileList: '' // as unknown as FileList,
}

/* ========================================================================

======================================================================== */

export const InputFileDemo = () => {
  const {
    register,
    reset,
    handleSubmit,
    // trigger,
    // watch,
    setValue,
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
          noValidate // Not really needed, but doesn't hurt.
        >
          {/* =====================
       
          ===================== */}

          <InputFile
            // multiple
            accept='image/png, image/jpeg, image/jpg'
            error={errors?.fileList?.message}
            formGroupClassName='mb-4'
            id='fileList'
            label='Select an Image File'
            labelRequired
            onClear={() => {
              if (touchedFields?.fileList) {
                setValue('fileList', '', {
                  shouldValidate: true,
                  shouldTouch: true
                })
              }
            }}
            size='sm'
            touched={touchedFields?.fileList}
            ///////////////////////////////////////////////////////////////////////////
            //
            // Note: react-hook-form does not capture the input type='file' value
            // (e.g. e.target.value). Nor would you want it to because it would just be something
            // like:  C:\fakepath\someImage.png. Instead, for input type='file', react-hook-form
            // stores the FileList in state. Generally, however, that's NOT what we want.
            // Rather, we want the files/files themselves. The easiest way to deal with this
            // is to simply remember to extract the file(s) from the FileList within the
            // onSubmit handler.
            //
            // https://claritydev.net/blog/react-hook-form-multipart-form-data-file-uploads
            //
            ///////////////////////////////////////////////////////////////////////////
            {...register('fileList')}
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
