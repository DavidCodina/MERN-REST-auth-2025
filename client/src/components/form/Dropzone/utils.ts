import { PreviewObject } from './types'
import { isFileArray } from 'utils'

/* ======================
    setFilePreviews()
====================== */
// In the Hamed Bahram tutorial, he uses the URL.createObjectURL() approach.
// However, that implementation requires also using revokeObjectURL() and
// has a higher likelihood of creating a memory leak. It's generally easier
// to just use new FileReader()

export const setFilePreviews = async (
  files: File[] | null,
  setPreviews: React.Dispatch<React.SetStateAction<PreviewObject[] | null>>
): Promise<PreviewObject[] | null> => {
  if (Array.isArray(files) && files.length > 0 && isFileArray(files)) {
    try {
      // i.e., [{ name: "peter.png", readerResult: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPc..." }]
      const previewObjects = await Promise.all(
        files.map(async (file) => {
          const previewObject: PreviewObject = {
            name: file.name,
            readerResult: ''
          }

          await new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = () => {
              previewObject.readerResult = (reader.result || '') as string
              resolve(previewObject)
            }
            reader.onerror = (err) => {
              reject(err) // Re-throw the error for consistent handling
            }
            reader.readAsDataURL(file)
          })

          return previewObject
        })
      )

      ///////////////////////////////////////////////////////////////////////////
      //
      // Rather than explicitly filtering out non images here:
      //
      //   const onlyImagePreviewObjects = previewObjects.filter((preview) => {
      //     return preview.readerResult.substring(5, 10) === 'image'
      //   })
      //
      // It's up to the consuming code to check the value of readerResult:
      //
      //   {preview.readerResult.substring(5, 10) === 'image' ? (
      //     <img className='h-full w-full object-contain'  src={preview.readerResult} alt={preview.name} />
      //   ) : (
      //     <div className='break-all p-2 font-bold text-white' style={{ fontSize: 10 }}>
      //       {preview.name}
      //     </div>
      //   )}
      //
      ///////////////////////////////////////////////////////////////////////////

      setPreviews(previewObjects)
      return previewObjects
    } catch (_err) {
      // console.error('Error generating file previews:', err)
      setPreviews(null)
      return null
    }
  }

  setPreviews(null)
  return null
}

/* ======================
      deepEqual()
====================== */

export const deepEqual = (a: any, b: any) => {
  if (a === b) {
    return true
  }

  if (
    a === null ||
    typeof a !== 'object' ||
    b === null ||
    typeof b !== 'object'
  ) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}
