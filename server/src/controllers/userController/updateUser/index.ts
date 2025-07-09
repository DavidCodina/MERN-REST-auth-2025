import { Request, Response /*, NextFunction */ } from 'express'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

import User from 'models/userModel'
import { codes, getZodErrors, handleServerError } from 'utils'
import { getUpdateUserSchema } from './getUpdateUserSchema'
import { ResBody, User as UserType } from 'types'

/* ========================================================================
                            updateUser()
======================================================================== */

export const updateUser = async (
  req: Request,
  res: Response<ResBody<UserType | null>>
) => {
  const userId = req.user?._id

  ///////////////////////////////////////////////////////////////////////////
  //
  // A client form may initialize field values as ''. If they then inadvertently send those
  // values, the Zod validation's optional() method WILL validate against them.
  // In this specific case, '' is never an allowed value. Consequently, we can preempt this
  // by setting '' values to undefined in the resolver.
  //
  //   let { userName, firstName, lastName email, password, confirmPassword } = req.body
  //   userName  = userName || undefined
  //   firstName = firstName || undefined
  //   lastName  = lastName || undefined
  //   email     = email || undefined
  //   password  = password || undefined
  //   confirmPassword = confirmPassword || undefined
  //
  // It may seem more idiomatic to handle the transformation in the Zod schema:
  //
  //    .transform((val) => val || undefined).optional()
  //
  //  However, this inevitably leads to complications with methods like .min(), .email(), etc.
  //
  // In any case, it's not really the responsibility of the server to preempt this issue.
  // If the client sends us '' values, we simply send them back an error.
  // The server's job is to validate that the data it receives is correct, not to guess what
  // the client "really meant" when it sends empty strings.
  //
  ///////////////////////////////////////////////////////////////////////////

  const {
    userName,
    firstName,
    lastName,
    email,
    //# image,
    password,
    confirmPassword
  } = req.body

  /* ======================
        ObjectId Check
  ====================== */
  // We might not need this if it's already using the middleware version.

  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({
      code: codes.BAD_REQUEST,
      data: null,
      message: 'The ObjectId format is invalid.',
      success: false
    })
  }

  try {
    const user = await User.findById(userId).exec()

    /* ======================
          Existence Check
    ====================== */

    if (!user) {
      return res.status(404).json({
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    /* ======================
          Validation
    ====================== */

    const existingUser = await User.findOne({
      email: new RegExp(`^${email}$`, 'i')
    })
      .lean()
      .exec()

    const UpdateUserSchema = getUpdateUserSchema({
      userId,
      existingUser,
      password
    })

    const validationResult = UpdateUserSchema.safeParse({
      userName,
      firstName,
      lastName,
      email,
      //# image: imageURL,
      password,
      confirmPassword
    })

    // Leverage the discriminated union.
    // Prior to this, validationResult.data is ?.
    if (!validationResult.success) {
      // At this point, we know that there are errors, and getZodErrors()
      // ALWAYS return an object. This pretty much guarantees that there
      // will be at least one property in formErrors - unless something
      // very unexpected happens in the getZodErrors() utility.
      const errors = getZodErrors(validationResult.error)

      return res.status(400).json({
        code: codes.FORM_ERRORS,
        data: null,
        errors: errors,
        message: 'The form data is invalid.',
        success: false
      })
    }

    // At this point data is assured, but any given field may be undefined.
    const validated = validationResult.data

    /* ======================

    ====================== */

    if (validated.userName) {
      user.userName = validated.userName
    }

    if (validated.firstName) {
      user.firstName = validated.firstName
    }

    if (validated.lastName) {
      user.lastName = validated.lastName
    }

    if (validated.email && typeof validated.email === 'string') {
      user.email = validated.email
    }

    if (validated.image) {
      user.image = validated.image
    }

    if (validated.password) {
      const hashedPassword = await bcrypt.hash(validated.password, 10)
      user.password = hashedPassword
    }

    let updatedUser: any = await user.save()

    ///////////////////////////////////////////////////////////////////////////
    //
    // At this point, it's difficult to omit fields from updatedUser
    // with projection or using .select(). We can instead do this, which
    // still feels kind of hacky.
    //
    // delete updatedUser._doc.password
    //
    // Alternatively, one could requery for the user. A slightly better approach is
    // to use the built-in toObject() method. Then do this:
    //
    //   updatedUser = updatedUser.toObject()
    //   delete updatedUser.password
    //
    // Note: You have to reassign updatedUser back onto itself. Otherwise, it won't work.
    //
    // See also:
    //
    //   https://stackoverflow.com/questions/57653175/how-to-hide-some-properties-after-receiving-result-when-saving-mongoose-object
    //   https://stackoverflow.com/questions/14196162/after-saving-an-object-using-mongoose-what-is-the-simplest-way-i-can-return-an
    //
    ///////////////////////////////////////////////////////////////////////////

    updatedUser = updatedUser.toObject()
    delete updatedUser.password

    return res.status(200).json({
      code: codes.UPDATED,
      // Whatever is returned here should always match what is returned by
      // getCurrentUser(). Why? Because the client could be using response
      // data to update the client state for the current user.
      data: updatedUser,
      message: 'Resource updated.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
