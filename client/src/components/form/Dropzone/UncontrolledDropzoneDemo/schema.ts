import { z } from 'zod'
import { isFileArray } from 'utils'

/* ========================================================================

======================================================================== */

export const schema = z.object({
  files: z
    .custom<File[] | null>(
      (value) => {
        if (!value || !isFileArray(value)) {
          return false
        }

        if (!Array.isArray(value) || value.length === 0) {
          return false
        }

        return true
      },
      {
        fatal: false,
        message: 'Please select a file.'
      }
    )

    .refine(
      (value) => {
        const allowedValues = [
          'image/png',
          'image/jpeg',
          'image/jpg'
          // 'image/webp',
          // 'application/json'
        ]

        // A helper to check file.type against allowedValues.
        const isOneOf = (value: any, allowedValues: any[]) => {
          if (allowedValues.indexOf(value) !== -1) {
            return true
          }
          return false
        }

        // Double check that it's of type File[]
        if (!isFileArray(value)) {
          return false
        }

        // Validate against each file in File[].
        // Similar to value.every((item) => item instanceof File)
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
