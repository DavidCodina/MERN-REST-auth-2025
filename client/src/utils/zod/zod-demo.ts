import { z } from 'zod'
import { getZodErrors } from './'

/* ========================================================================

======================================================================== */
//# Create a blog post for this...

const DataSchema = z.object({
  name: z.string().min(1, 'A name is required.'),
  email: z.string().email('A valid email is required'),
  password: z.string().min(5, 'Must be at least 5 characters.'),
  confirmPassword: z.string().min(1, 'Required.'),
  address: z.object({
    city: z.string().min(1, 'A city is required.'),
    zip: z.string().min(1, 'A zip is required.')
  }),
  myArray: z.array(z.string())
})

const requestData = {
  name: 'David',
  email: 'david@example.com',
  password: '',
  confirmPassword: '123456',
  address: {
    city: 'Georgetown',
    zip: 80444 // ❌ path: [ 'address', 'zip' ],
  },
  myArray: ['string1', 123, 'string3'] // ❌ path: [ 'myArray', 1 ],
}

const validationResult = DataSchema.safeParse(requestData)

let formErrors = validationResult.error
  ? getZodErrors(validationResult.error)
  : {}

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: When .refine() and .superRefine() are appended to the outside of the
// schema, they will short-circuit if there's ANY errors within the primary schema validation.
// Generally, these methods can also be used insidethe schema, but for cross-field validation
// they MUST be on the outside.
//
// Conclusion: don't use .refine() or .superRefine() outside of the schema, and
// for cases where you have no other choice, then use an additional PartialDataSchema.
//
// Note: this may not be an issue when using a schema with @hookform/resolvers
// on the client. If that's true, then I wonder what they're doing differently.
//
// ❓ In the case of safe-parsing `PartialDataSchema`, it seems like the behavior is different
// such that even if the password is invalid it still runs the .refine() validation.
//
// Working with cross-field validation in Zod is a pain, but it's not that bad once you
// get the hang of it.
//
///////////////////////////////////////////////////////////////////////////

const PartialDataSchema = DataSchema.partial().refine(
  (data) => {
    const isValid = data.password === data.confirmPassword
    return isValid
  },
  {
    message: 'The passwords must match.',
    // ⚠️ When you specify a path in your .refine() validation, you're explicitly telling Zod
    // "treat this as a field error, not a form error." This part is crucial because
    // the custom getZodErrors() utility will not detect the error if we don't do this.
    // However, this in NOT needed when the .refine() is inside the schema, chained off of the
    // field validation. In that case, getZodErrors() would end up returning:
    // 'confirmPassword.confirmPassword': 'The passwords must match.'
    path: ['confirmPassword']
  }
)

const passwordValidationResult = PartialDataSchema.safeParse({
  password: requestData.password,
  confirmPassword: requestData.confirmPassword
})

if (passwordValidationResult.error) {
  const passwordErrors = getZodErrors(passwordValidationResult.error)
  if (passwordErrors) {
    formErrors = { ...formErrors, ...passwordErrors }
  }
}

if (Object.keys(formErrors).length > 0) {
  console.log('formErrors:', formErrors)
} else {
  console.log('There are no form errors!')
}

//# Note: If you don't need to abstract the schema from the controller/resolver, then
//# you can define it direclty within the scope of the resolver. Then create a .refine() on
//# the `confirmPassword` field, WITHIN the schema that is within the scope of  `input.password`.
//# Alternatively, you can create a makeSchema() function that gives you back an ephemeral instance
//# of the schema.
