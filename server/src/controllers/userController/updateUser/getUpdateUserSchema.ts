import mongoose from 'mongoose'
import { z } from 'zod'

/* ========================================================================

======================================================================== */

export const getUpdateUserSchema = ({
  userId,
  existingUser,
  password
}: {
  userId: mongoose.Types.ObjectId
  existingUser: { _id: mongoose.Types.ObjectId } | null
  password: unknown
}) => {
  const UpdateUserSchema = z.object({
    userName: z.string().trim().min(1, 'A userName is required.').optional(),
    firstName: z.string().trim().min(1, 'A first name is required.').optional(),
    lastName: z.string().trim().min(1, 'A last name is required.').optional(),

    email: z
      .string()
      .email('A valid email is required.')
      // The email logic checks the new email against any existing users.
      // If an existing user is found, then an error is generated when
      // the existing user's _id and the current userId are different.
      // This allows the client to pass the current user's email as
      // part of the update.
      .refine(
        (_data) => {
          if (existingUser && !existingUser._id.equals(userId)) {
            return false
          }
          return true
        },
        { message: 'A user with that email already exists. (Server)' }
      )
      .optional(),

    password: z.string().min(5, 'Must be at least 5 characters.').optional(),
    image: z.string().optional(),

    confirmPassword: z
      .string()
      .optional()
      .refine(
        (data) => {
          // If no password provided, confirmPassword can be anything.
          if (!password) {
            return true
          }

          // If password is provided, confirmPassword is required.
          if (!data) {
            return false
          }

          // If both are provided, then they must match.
          return data === password
        },
        (data) => {
          if (password && !data) {
            return {
              message:
                'confirmPassword is required when a password is being updated.'
            }
          }
          return { message: 'The passwords must match.' }
        }
      )
  })

  return UpdateUserSchema
}
