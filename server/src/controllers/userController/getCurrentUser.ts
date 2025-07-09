import { Request, Response /*, NextFunction */ } from 'express'
import { codes, handleServerError } from 'utils'
import { ResBody, User as UserType } from 'types'

type PartialUser = Partial<UserType>

/* ======================
    getCurrentUser()
====================== */

export const getCurrentUser = async (
  req: Request,
  res: Response<ResBody<PartialUser | null>>
) => {
  const user = req.user

  // Create a copy to avoid mutating the original user object.
  const partialUser: PartialUser | null =
    user && typeof user === 'object' ? { ...user } : null

  try {
    if (partialUser?.password) {
      delete partialUser.password
    }

    return res.status(200).json({
      code: codes.OK,
      data: partialUser,
      message: 'Request successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
