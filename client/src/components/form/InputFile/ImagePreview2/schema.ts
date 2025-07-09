import { z } from 'zod'

export const schema = z.object({
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

export type FormValues = z.infer<typeof schema>
