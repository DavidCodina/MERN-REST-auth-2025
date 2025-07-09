import {
  Fragment,
  useState,
  useEffect,
  useRef
  //, forwardRef
} from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { sleep } from 'utils'
import { InputFile } from '../'
import imagePlaceholder from './add-photo.svg'
import { schema, FormValues } from './schema'

const defaultValues: FormValues = {
  fileList: '' // as unknown as FileList,
}

/* ========================================================================
            
======================================================================== */

export const ImagePreview = () => {
  const firstBlurRef = useRef(true)
  const [preview, setPreview] = useState('') // reader.result is base64 string.
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    reset,
    handleSubmit,
    // trigger,
    watch,
    setValue,

    getValues,
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

  const { onBlur, ref, ...otherFileListRegisterProps } = register('fileList')

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
    console.log('onSubmit called.', data)
    await sleep(1000) // await API call
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // If you have a file-upload-server running then do something like this:
  //
  // const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
  //   console.log('onSubmit called.', data)
  //   await sleep(1000) // await API call
  //
  //   // With react-hook-form, if Zod validation passed then we know
  //   // we have a File. Still, I'm doing this here
  //   const file = data?.fileList?.[0]
  //   if (file instanceof File) {
  //     const formData = new FormData()
  //
  //     formData.append('image', file)
  //
  //     fetch('http://localhost:5000/api/image-upload', {
  //       method: 'POST',
  //       body: formData
  //       // When you’re sending a file with FormData using the fetch() API, you don’t
  //       // need to manually set the Content-Type header. The browser will automatically
  //       // set it to multipart/form-data and appropriately handle the boundary between parts.
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log('Response data:', data)
  //         return data
  //       })
  //       .catch((err) => console.error(err))
  //   }
  // }
  //
  ///////////////////////////////////////////////////////////////////////////

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
  ///////////////////////////////////////////////////////////////////////////
  //
  // Handle when the value changes by updating the preview. This version uses URL.createObjectURL(),
  // but in many examples a new FileReader() is used instead. AI:
  //
  // Both URL.createObjectURL and FileReader are valid ways to read and display selected files in JavaScript,
  // and they each have their own advantages:
  //
  //   URL.createObjectURL: This method creates a simple object URL, which can be very efficient for large
  //                        files because it doesn’t read the entire file into memory. However, these object
  //                        URLs need to be manually revoked with URL.revokeObjectURL when they are no longer
  //                        needed to avoid memory leaks.
  //
  //   FileReader:          The readAsDataURL method reads the entire file into memory as a base64 encoded string.
  //                        This can be less efficient for large files, but it doesn’t require any cleanup like URL.createObjectURL.
  //
  // So, the best approach depends on your specific use case. If you’re dealing with large files and memory usage is a concern,
  // URL.createObjectURL might be a better choice. If you don’t want to worry about revoking object URLs and the files aren’t too large,
  // FileReader could be simpler to use. Both methods are widely supported and should work in all modern browsers.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const subscription = watch((value) => {
      const maybeFileList = value.fileList

      if (maybeFileList instanceof FileList) {
        const maybeFile = maybeFileList[0]

        if (
          maybeFile instanceof File &&
          maybeFile.type.substring(0, 5) === 'image'
        ) {
          // https://javascript.info/file#filereader
          // Read the file, and set the result in the preview. Presumably, this gets
          //  garbage collected after the function completes since it  is out of scope
          // and no longer reachable. Unlike using URL.createObjectURL(), there is
          // nothing in the documentation that necessitates memory management.
          // That said, it seems that where people get into trouble with new FileReader
          // is when they call it in a loop.
          const reader = new FileReader()

          // The Leigh Halliday version used reader.onloadend, but that looks deprecated in MDN.
          // Plus we probably don't want that since "The loadend event is fired when a file read has
          // completed, successfully or not."
          reader.onload = () => {
            // TS may argue that argument of type 'string | ArrayBuffer'
            // is not assignable to parameter of 'SetStateAction<string>'. This happens because there's actually
            // another method on reader called reader.readAsArrayBuffer() which returns an ArrayBuffer.
            // Essentially, TS is trying to protect us against the possibility that it might be an ArrayBuffer.
            // Consequently, in TS we will have to typecas the result.
            // See Leigh Halliday video at 9:00: https://www.youtube.com/watch?v=BPUgM1Ig4Po
            setPreview(reader.result as string)
          }

          // Probably not necessary since we're checking for file in advance, but still good to have.
          reader.onerror = (_err) => {
            setPreview('')
          }

          reader.readAsDataURL(maybeFile) // https://www.youtube.com/watch?v=BPUgM1Ig4Po at 7:50
        } else {
          // Initially I was using null, but reader.result is actually a base64 string
          setPreview('')
        }
      }
      // If for some reason it's not an image file, then clear preview.
      // This could also occur when a user selects a file then selects 'Cancel',
      // which would then clear the image.
      else {
        // Initially I was using null, but reader.result is actually a base64 string
        setPreview('')
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  /* ======================
          useEffect()
  ====================== */
  // This is the alternate implementation that uses URL.createObjectURL. However,
  // it seems less common and has more potential to create a memory leak.
  // This approach was demonstrated in the  Mirko Nasato Ionic tutorial.
  //
  //    https://gale.udemy.com/course/ionic-react/learn/lecture/19934926#overview
  //
  // It requires memory cleanup for blobs

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     const maybeFileList = value.fileList

  //     if (maybeFileList instanceof FileList) {
  //       const maybeFile = maybeFileList[0]
  //       if (maybeFile instanceof File) {
  //         const pictureUrl = URL.createObjectURL(maybeFile) // Also type string albeit a blob.
  //         setPreview(pictureUrl)
  //       } else {
  //         setPreview('') // Initially I was using null, but reader.result is actually a base64 string
  //       }
  //     }
  //     // If for some reason it's not an image file, then clear image, and preview.
  //     // This could also occur when a user selects a file then selects 'Cancel',
  //     // which would then clear the image.
  //     else {
  //       setPreview('') // Initially I was using null, but reader.result is actually a base64 string
  //     }
  //   })

  //   return () => subscription.unsubscribe()
  // }, [watch])

  /* ====================
       useEffect()
  ==================== */
  // When component unmounts and prior to preview changing (selecting new picture),
  // revoke the previous objectURL. Just be careful at what point in the component tree this is done.
  // The nice thing is that this also runs when setPreview('') after the form is successfully submitted.

  // Mirko Nasato implementation.
  // useEffect(() => {
  //   return () => {
  //     if (preview.startsWith('blob:')) {
  //       console.log('Revoking objectURL for: ', preview)
  //       // If there is a blob url in memory, then remove it to preserve memory.
  //       // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#memory_management
  //       URL.revokeObjectURL(preview)
  //     }
  //   }
  // }, [preview])

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})

      setPreview('')
      toast.success('Form validation success!')
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
    renderImagePreview()
  ====================== */

  const renderImagePreview = () => {
    return (
      <div
        className='mx-auto aspect-[3/1]'
        style={{ outline: '1px dashed rgba(0,0,0,0.15' }}
      >
        <div className='flex h-full w-full items-center justify-center'>
          <button
            //! bg-dark ???
            className='border-dark bg-dark mx-auto block h-full overflow-hidden rounded-lg border shadow-sm'
            onClick={(_e) => {
              if (fileInputRef.current) {
                if (firstBlurRef.current === true) {
                  setTimeout(() => {
                    const values = getValues()

                    setValue('fileList', values.fileList, {
                      shouldTouch: true,
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }, 500)
                }

                fileInputRef.current.click()
              }
            }}
            type='button'
          >
            <img
              className='block h-full overflow-hidden'
              // This may be a good time to review the CSS object-fit property.
              // Conversely, we don't seem to need it.
              // An <img>'s src can receive a base64 string (in addition to file or url to file).
              src={preview ? preview : imagePlaceholder}
              alt=''
            />
          </button>
        </div>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

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
        <div className='mb-4'>
          <label
            htmlFor='image-file'
            className='form-label text-sm font-bold text-blue-500'
          >
            Select Image:
          </label>

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
            // {...register('fileList')}

            ref={(node) => {
              ref(node)
              fileInputRef.current = node
            }}
            // This is a hack to prevent the react-hook-form onBlur() validation from running until
            // the computer's file selection popup has already appeared. It could also be baked into
            // InputFile component.

            onBlur={(e) => {
              if (firstBlurRef.current === true) {
                setTimeout(() => {
                  firstBlurRef.current = false
                  onBlur(e)
                }, 500)
              } else {
                onBlur(e)
              }
            }}
            {...otherFileListRegisterProps}
          />

          {renderImagePreview()}
        </div>

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
