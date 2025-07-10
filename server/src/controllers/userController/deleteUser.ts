import { Request, Response /*, NextFunction */ } from 'express'
import User from 'models/userModel'
import { codes, handleServerError } from 'utils'
import { ResBody } from 'types'

/* ========================================================================
                              deleteUser()
======================================================================== */
// ⚠️ Ideally, there should be a check to see if the user to be deleted is an admin.
// Then check to see how many admins there are. If there's only one, then this means
// we'd be deleting the only admin. This should not be allowed.

export const deleteUser = async (
  req: Request,
  res: Response<ResBody<null>>
) => {
  const userId = req?.user?._id

  try {
    // Technically, there's no reason to omit `password`, `refreshTokenBlacklist`,
    // or `role` if they're already omitted from the userModel by default, but it doesn't hurt.
    const user = await User.findById(
      userId,
      '-password -refreshTokenBlacklist -role'
    ).exec()

    if (!user) {
      return res.status(404).json({
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Delete associated user resources first.
    //
    // Here we can handle the delete cascade directly within the controller.
    // However, It's more idiomatic to use  a pre() hook in the userModel.ts:
    //
    // Stephen Grider does that here:
    //
    //   https://www.udemy.com/course/the-complete-developers-guide-to-mongodb/learn/lecture/6035632#overview
    //   https://www.udemy.com/course/the-complete-developers-guide-to-mongodb/learn/lecture/6035636#overview
    //
    ///////////////////////////////////////////////////////////////////////////

    const _deletedUser = await user.deleteOne()

    return res.status(200).json({
      code: codes.DELETED,
      data: null,
      message: `The user ${user.firstName} ${user.lastName} with an 'id' of ${user._id} has been deleted.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
