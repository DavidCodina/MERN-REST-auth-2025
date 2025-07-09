import {
  Fragment,
  useState,
  useEffect,
  useRef
  //, forwardRef
} from 'react'
import imagePlaceholder from './add-photo.svg'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////////////////
//
//  The basic implementation is fairly simple, but there's a little bit more to
//  doing it correctly.
//
//    https://gale.udemy.com/course/ionic-react/learn/lecture/19934926#overview
//
//
//  This demo has incorporated the memory cleanup for blobs that was shown in the
//  Mirko Nasato Ionic tutorial.
//
// Leigh Halliday: https://www.youtube.com/watch?v=BPUgM1Ig4Po
//
///////////////////////////////////////////////////////////////////////////////////////

export const ImagePreview = () => {
  const [image, setImage] = useState(null) // In Typescript we would set it to useState<File | null>(null);
  const [preview, setPreview] = useState('') // reader.result is base64 string.
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /* ====================
       useEffect()
  ==================== */
  // When component unmounts and prior to preview changing (selecting new picture),
  // revoke the previous objectURL. Just be careful at what point in the component tree this is done.

  // Mirko Nasato implementation.
  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) {
        //! ES6 startsWith() - I'd prefer not to use this.
        console.log('Revoking objectURL for: ', preview)
        // If there is a blob url in memory, then remove it to preserve memory.
        // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#memory_management
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  /* ====================
    handleFileChange()
  ==================== */
  // This will also run when the user selects the <input type='file' />, then selects 'Cancel'.

  const handleFileChange = (e: any) => {
    // e: React.ChangeEvent<HTMLInputElement>;
    const file = e.target.files[0] // FileList

    // Mirko Nasato implementation.
    if (file) {
      const pictureUrl = URL.createObjectURL(file) // Also type string albeit a blob.
      setPreview(pictureUrl)
    }

    // If for some reason it's not an image file, then clear image, and preview.
    // This could also occur when a user selects a file then selects 'Cancel',
    // which would then clear the image.
    else {
      setImage(null)
      setPreview('') // Initially I was using null, but reader.result is actually a base64 string
    }
  }

  /* ====================
    handleFileChange2()
  ==================== */
  // This is not actually being used, but is closer to what
  // Leigh Halliday actually did in the tutorial.
  // I prefer the Mirko Nasato implementation.
  // That said, URL.createObjectURL() will only work on IE 11+,
  // while FileReader is supported in IE 10.

  const _handleFileChange2 = (e: any) => {
    // e: React.ChangeEvent<HTMLInputElement>;
    const file = e.target.files[0] // FileList

    // Second check is another failsafe on top of accept attribute to ensure we are only grabbing images.
    if (file && file.type.substr(0, 5) === 'image') {
      // Store the image file in state for when you eventually send the data.
      setImage(file)

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
        setPreview(reader.result as string) // In Ts: reader.result as string

        // console.log('\nreader.result: ', reader.result);
      }

      // Probably not necessary since we're checking for file in advance, but still good to have.
      reader.onerror = () => {
        setImage(null)
        setPreview('')
      }

      reader.readAsDataURL(file) // https://www.youtube.com/watch?v=BPUgM1Ig4Po at 7:50
    }

    // If for some reason it's not an image file, then clear image, and preview.
    // This could also occur when a user selects a file then selects 'Cancel',
    // which would then clear the image.
    else {
      setImage(null)
      setPreview('') // Initially I was using null, but reader.result is actually a base64 string
    }
  }

  /* ====================
       handleSubmit()
  ==================== */

  const handleSubmit = (e: any) => {
    e.preventDefault()

    alert('Submitting...')

    // input type="file" are never controlled, so you have to clear the input using reset().
    // The fact that files are never controlled, may necessitate a unique implementation  when
    // using formik.
    e.target.reset()
    setImage(null)
    setPreview('')
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
        noValidate // Not really needed, but doesn't hurt.
      >
        <div className='mb-4'>
          <label
            htmlFor='image-file'
            className='form-label text-sm font-bold text-blue-500'
          >
            Select Image:
          </label>

          {/* This cold be a form-group that also has a remove button. */}
          <input
            ref={fileInputRef}
            id='image-file'
            className='form-control form-control-sm mb-4'
            accept='image/*' //# Could limit images even more.
            type='file'
            onChange={handleFileChange}
            // hidden
          />

          <div
            className='mx-auto aspect-[3/1]'
            style={{ outline: '1px dashed rgba(0,0,0,0.15' }}
          >
            <div className='flex h-full w-full items-center justify-center'>
              <button
                //! bg-dark
                className='border-dark bg-dark mx-auto block h-full overflow-hidden rounded-lg border shadow-sm'
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click()
                  }
                }}
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
        </div>

        {/* =====================
             Submit Button
        ===================== */}

        <button
          className='btn-green btn-sm block w-full'
          disabled={!image}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </Fragment>
  )
}
