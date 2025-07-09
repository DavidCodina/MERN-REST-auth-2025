import mongoose from 'mongoose'
import { z } from 'zod'

/* ========================================================================

======================================================================== */
// This helper takes in the existingUser and password from the scope of the resolver.
// It returns the CreateUserSchema. This gives the Schema access to variables from the
// scope of the resolver, but without cluttering the resolver.

export const getCreateUserSchema = ({
  existingUser,
  password
}: {
  existingUser: { _id: mongoose.Types.ObjectId } | null
  password: unknown
}) => {
  const CreateUserSchema = z.object({
    userName: z.string().min(1, 'A userName is required.'),

    firstName: z.string().min(1, 'A first name is required.'),

    lastName: z.string().min(1, 'A last name is required.'),

    ///////////////////////////////////////////////////////////////////////////
    //
    // Custom logic would look something like this:
    //
    //   const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    //
    //   if (!email) {
    //     formErrors.email = 'Email is required. (Server)'
    //   } else if (!regex.test(email)) {
    //     formErrors.email = 'A valid email is required. (Server)'
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    email: z
      .string()
      .email('A valid email is required.')
      .refine(
        (_data) => {
          if (existingUser) {
            return false
          }
          return true
        },
        { message: 'A user with that email already exists. (Server)' }
      ),
    password: z.string().min(5, 'Must be at least 5 characters.'),
    confirmPassword: z
      .string()
      .min(1, 'Required.')
      .refine(
        (data) => {
          // Use the password from the scope of the resolver, rather
          // than using an external .refine() or partial schema.
          const isValid = data === password
          return isValid
        },
        {
          message: 'The passwords must match.'
        }
      )
  })

  return CreateUserSchema
}
