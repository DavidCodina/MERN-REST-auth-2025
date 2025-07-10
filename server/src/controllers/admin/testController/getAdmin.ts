import { Request, Response } from 'express'
import { codes, handleServerError } from 'utils'
import { ResBody, User as UserType } from 'types'

type PartialUser = Partial<UserType>

/* ========================================================================

======================================================================== */
// http://localhost:5000/api/admin/test

export const getAdmin = async (
  req: Request,
  res: Response<ResBody<PartialUser | null>>
) => {
  const user = req.user

  // Create a copy to avoid mutating the original user object.
  const partialUser: PartialUser | null =
    user && typeof user === 'object' ? { ...user } : null

  try {
    // Technically, there's no reason to delete `password`
    // or `refreshTokenBlacklist` if it's already omitted
    // in the userModel by default, but it doesn't hurt.
    if (partialUser?.password) {
      delete partialUser.password
    }

    if (partialUser?.refreshTokenBlacklist) {
      delete partialUser.refreshTokenBlacklist
    }

    return res.status(200).json({
      code: codes.OK,
      data: partialUser,
      message: 'Request for admin data successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
