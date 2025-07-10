import { Request, Response /*, NextFunction */ } from 'express'
import User from 'models/userModel'
import { codes, handleServerError } from 'utils'
import { ResBody, User as UserType } from 'types'

/* ====================== 
      softDeleteUser()
====================== */

export const softDeleteUser = async (
  req: Request,
  res: Response<ResBody<UserType | null>>
) => {
  const userId = req?.user?._id

  try {
    // Technically, there's no reason to omit `password`, `refreshTokenBlacklist`,
    // or `role` if they're already omitted from the userModel by default, but it doesn't hurt.
    const user = await User.findById(
      userId,
      '-password -refreshTokenBlacklist -role'
    ).exec()

    /* ======================
          User Check
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
        isDeactivated Check
    ====================== */

    const isDeactivated = user.isActive === false

    if (isDeactivated) {
      return res.status(409).json({
        code: codes.USER_ARCHIVED,
        data: null,
        message: 'The user was previously deleted.',
        success: false
      })
    }

    /* ======================
          Soft Delete
    ====================== */

    user.isActive = false
    const archivedEmail = `__ARCHIVED_AT_${Date.now()}__${user.email}`
    user.email = archivedEmail
    const updatedUser = await user.save()

    /* ======================

    ====================== */

    return res.status(200).json({
      code: codes.UPDATED,
      data: updatedUser, // Or just send back null
      message: `The user ${updatedUser.firstName} ${updatedUser.lastName} with an 'id' of ${updatedUser._id} has been deleted.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
