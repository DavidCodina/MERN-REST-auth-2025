type API_Response<T = unknown> = Promise<{
  data: T
  message: string
  success: boolean
  errors?: Record<string, string> | null
}>

type Data = null
type UploadImageResponse = API_Response<Data>
type UploadImage = (file: File) => UploadImageResponse

/* ========================================================================
                                  uploadImage()      
======================================================================== */

export const uploadImage: UploadImage = async (
  file
): ReturnType<UploadImage> => {
  if (!file || !(file instanceof File)) {
    return {
      data: null,
      message: 'Invalid type (not File).',
      success: false
    }
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await fetch(`http://localhost:5000/api/image-upload`, {
      method: 'POST',
      body: formData
      ///////////////////////////////////////////////////////////////////////////
      //
      // When you use FormData as the body of your fetch request, the browser automatically sets the Content-Type
      // header to multipart/form-data with the appropriate boundary. Therefore, you don’t need to manually set
      // the Content-Type header. In fact, you shouldn't set this as it will cause the browser to error with:
      //
      //   Error: Multipart: Boundary not found
      //
      // When you use FormData in a fetch request, the browser automatically sets the Content-Type header to
      // multipart/form-data along with a unique boundary string. This boundary string is essential for separating
      // the different parts of the form data.
      //
      ///////////////////////////////////////////////////////////////////////////
      // ❌ headers: { 'Content-Type': 'multipart/form-data' }
    })

    const json = (await res.json()) as Awaited<ReturnType<UploadImage>>

    return json
  } catch (err) {
    if (err instanceof Error) {
      console.log({ message: err.message })
    }

    return {
      data: null,
      message: 'Request failed.',
      success: true
    }
  }
}
