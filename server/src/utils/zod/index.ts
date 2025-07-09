import { z } from 'zod'

/* ======================
      getZodErrors()
====================== */

export const getZodErrors = (error: z.ZodError) => {
  const issues = error.issues
  const errors: Record<string, string> = {}

  for (const issue of issues) {
    if (issue?.path?.length) {
      // An error that occurred in a nested object with be concatenated
      // with dot notation such that [ 'address', 'zip' ] => 'address.zip'.
      // Similarly, if an error occurred in an element index 1 of myArray,
      // ['myArray', 1] => 'myArray.1'.
      const key = issue.path.join('.')
      errors[key] = issue.message
    }
  }
  return errors
}

///////////////////////////////////////////////////////////////////////////
//
// Get concise Zod errors from the result of <Somechema>.safeParse(data)
//
// Usage:
//
// const DataSchema = z
//   .object({
//     name: z.string().min(1, 'A name is required.'),
//     email: z.string().email('A valid email is required'),
//     password: z.string().min(5, 'Must be at least 5 characters.'),
//     confirmPassword: z.string().min(1, 'Required.'),
//     address: z.object({
//       city: z.string().min(1, 'A city is required.'),
//       zip: z.string().min(1, 'A zip is required.')
//     }),
//
//     myArray: z.array(z.string())
//   })
//   .refine(
//     (data) => {
//       const isValid = data.password === data.confirmPassword
//       return isValid
//     },
//     {
//       message: 'The passwords must match.',
//       path: ['confirmPassword']
//     }
//   )
//
// const validationResult = DataSchema.safeParse({
//   name: 'David',
//   email: 'david@example.com',
//   password: '12345',
//   confirmPassword: '12345',
//   address: {
//     city: 'Georgetown',
//     zip: 80444 // ❌ path: [ 'address', 'zip' ],
//   },
//   myArray: ['string1', 123, 'string3'] // ❌ path: [ 'myArray', 1 ],
// })
//
// if (!validationResult.success) {
//   // console.log('\n\nError issues:', validationResult.error.issues)
//   const errors = getZodErrors(validationResult.error?.issues)
//   console.log('\n', errors, '\n\n')
// }
//
///////////////////////////////////////////////////////////////////////////

/* ======================
getZodErrorsWithFlatten()
====================== */
// This approach leverages the flatten() method of ZodError.
// However, it's not as precies as getZodErrors().

export const getZodErrorsWithFlatten = (error: z.ZodError) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Suppose we have an error at ['address', 'zip'] and ['myArray', 1].
  // The flatten() return flattened.fieldErrors, which is a key value dictionary
  // of all the errors. However, it doesn't specify where in a complex object the
  // error occurred.
  //
  // flattened: {
  //   formErrors: [],
  //   fieldErrors: {
  //     address: [ 'Expected string, received number' ],
  //     myArray: [ 'Expected string, received number' ]
  //   }
  // }
  //
  // Note: errors show up in formErrors when you use .refine().
  // That said, if you specify a path  (i.e., path: ['confirmPassword']),
  // you're explicitly telling Zod, "treat this as a field error, not a form error."
  //
  ///////////////////////////////////////////////////////////////////////////
  const flattened = error.flatten()

  const errors: Record<string, string> = {}

  // Handle field errors
  Object.entries(flattened.fieldErrors).forEach(([key, messages]) => {
    if (messages && messages.length > 0) {
      errors[key] = messages[0] // Take first error message
    }
  })

  // Handle form-level errors
  if (flattened.formErrors && flattened.formErrors.length > 0) {
    errors['_form'] = flattened.formErrors[0]
  }

  return errors
}
