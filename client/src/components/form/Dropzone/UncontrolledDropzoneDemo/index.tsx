'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { DropZone, DropzoneAPI } from '../'
import { schema } from './schema'
// import { uploadImage } from './uploadImage'

type FormValues = z.infer<typeof schema>
// type FormValues = Omit<z.infer<typeof schema>, 'files'> & { files: null }

const defaultValues: FormValues = {
  // One could also default to [] and the validation logic would still behave the same.
  // That said, it's best to be consistent with the internal default state of DropZone,
  // which is that files is null.
  files: null
}

/* ========================================================================
                                UncontrolledDropzoneDemo
======================================================================== */
// This version still uses React Hook Form, but it doesn't implement: value={values.files}
// This means we need some alternative approach to clear the Dropzone after submitting.
// Dropzone exposes api through the apiRef. Currently, api has one method on it: api.clear().
// This can be invoked programmatically at any point, but is most useful in the isSubmitSuccessful useEffect.

export const UncontrolledDropzoneDemo = () => {
  const apiRef = useRef<DropzoneAPI | null>(null)
  const dropZoneRef = useRef<HTMLDivElement | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [showPreviews, setShowPreviews] = useState(true)

  /* ======================
        useForm()
  ====================== */

  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    setError,
    // trigger,
    // watch,
    // control,
    // register,
    // unregister,
    formState: {
      errors,
      isValid,
      // isDirty,
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

  const onSubmit: SubmitHandler<FormValues> = /* async */ (data, _e) => {
    toast.success('Form validation success!')
    console.log('onSubmit called.', data)

    // Because of the validation on data.files, we know that there will
    // be an image. However, Typescript doesn't know this.
    const image = data.files?.[0]

    if (!(image instanceof File)) {
      return
    }

    // const result = await uploadImage(image)
    // if (result.success === true) {
    //   toast.success('Image uploaded.')
    // } else {
    //   console.log('uploadImages() response:', result)
    //   toast.error('Unable to upload image.')
    // }
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
  // This is the isSubmitSuccessful useEffect.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      // Manually, clearing the Dropzone is necessary for uncontrolled
      // implementation. Simply resetting RHF is not sufficient.
      apiRef.current?.clear()
      reset(undefined, {})
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mb-6 flex justify-center gap-4'>
        <button
          onClick={() => {
            setDisabled((v) => !v)
          }}
          className='btn-blue btn-sm'
        >
          disabled: {disabled ? 'true' : 'false'}
        </button>

        <button
          onClick={() => {
            setShowPreviews((v) => !v)
          }}
          className='btn-blue btn-sm'
        >
          showPreviews: {showPreviews ? 'true' : 'false'}
        </button>

        <button
          onClick={() => {
            const api = apiRef.current
            api?.clear()
            // There's no need to do this so long as the onChange is updating values.files.
            // setValue('files', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
          }}
          className='btn-blue btn-sm'
        >
          Clear Files
        </button>
      </div>

      <form
        className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
        style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        {/* For react-hook-form implementations, it might seem reasonable to use Controller.
        However, it isn't all that useful. Why? Because React Dropzone's input <input {...getInputProps() />
        doesn't actually get triggered onChange, onBlur, etc. For this reason, it also doesn't make 
        sense to spread { ...register('files') }. That said, it's still possible to integrate with 
        react-hook-form as follows. Needless to say, there's a lot of logic on the consuming side that 
        is easy to get wrong. */}

        <DropZone
          apiRef={apiRef}
          ref={dropZoneRef}
          error={errors?.files?.message}
          label='Drop A File (Uncontrolled)'
          labelRequired
          labelClassName='font-bold text-blue-500 text-sm'
          dropzoneOptions={{
            maxFiles: 1,

            // While React Dropzone does expose onDropAccepted, we actually want
            // to use the custom onChange because it hooks into ALL changes to files,
            // NOT just when files are dropped. This means we can also know when files
            // has been reset to null, which would otherwise not be impossible here.
            onDropAccepted: (_files, _event) => {
              // console.log('\nDrop Accepted:', { files, event })
            },

            // The goal with onDropRejected is to show a toast.error when something was rejected, but something
            // was also currently or previously accepted. Conversely, if there is nothing already accepted then show the error as
            // an actual RHF validation error.
            onDropRejected: (fileRejections, _event) => {
              const message =
                fileRejections?.[0]?.errors[0]?.message ||
                'One or more files were rejected.'

              // In cases where one file is accepted and one rejected, values.files may not yet
              // reflect the accepted file. In order to ensure that values.files shows the
              // accepted file, wrap in setTimeout to push to bottom of stack.
              setTimeout(() => {
                const values = getValues()

                if (
                  !values.files ||
                  (Array.isArray(values.files) && values.files.length === 0)
                ) {
                  //Again, wrap in setTimeout. Otherwise the default validation will have precedence.

                  setError('files', { type: 'custom', message: message })
                  setValue('files', values.files, {
                    // If you validate here, it will overwrite the error we just set.
                    shouldValidate: false,
                    shouldDirty: true,
                    shouldTouch: true
                  })
                } else {
                  setValue('files', values.files, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  })
                  // Note: All files will be rejected if the number of files exceeds maxFiles,
                  // if a file is over/under maxSize/minSize, etc.
                  // Here I'm merely showing the first error.
                  toast.error(message, {
                    autoClose: 5000
                  })
                }
              }, 0)
            },

            onFileDialogCancel: () => {
              const values = getValues()
              setValue('files', values.files, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              })
            },

            disabled: disabled,

            accept: {
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/png': ['.png']
              // 'image/gif': ['.gif'],
              // 'image/webp': ['.webp'],
              // 'application/json': ['.json']
            }
          }}
          touched={touchedFields?.files as boolean}
          acceptMessage='PNG and JPG files are allowed.'
          className='[--dropzone-preview-size:50px] [--dropzone-theme-color:--color-blue-500]'
          style={{}}
          showPreviews={showPreviews}
          formGroupClassName='mx-auto mb-4 w-full'
          formGroupStyle={{}}
          id='uncontrolled-dropzone'
          inputId='files'
          inputName='files'
          onBlur={(e) => {
            const currentFocusElement = document.activeElement
            // If new focus element is outside of DropZone, then call trigger(), or preferably setValue().
            // trigger('files') will work, but we actually want to update touched as well.
            if (!e.target.contains(currentFocusElement)) {
              const values = getValues()
              setValue('files', values.files, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              })
            }
          }}
          onChange={(newValue: any) => {
            setValue('files', newValue, {
              // When the react-hook-form calls reset(undefined, {}), it then triggers the onChange() handler.
              // In order to prevent validation AFTER reset, we need to specify to ONLY validate if filesTouched.
              shouldValidate: touchedFields.files ? true : false,
              shouldDirty: true,
              shouldTouch: true
            })
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
    </>
  )
}
