import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { codes, isRefreshTokenData } from 'utils'
import { ResBody, Session } from 'types'

/* ========================================================================

======================================================================== */
// Session data is private!
// The route is protected by authMiddleware.
// Not necessary, but we could do a blacklist check here as well.

export const getSession = async (
  req: Request,
  res: Response<ResBody<Session | null>>
) => {
  // Note: It's already necessary to scope the refreshToken cookie path to '/api/auth'
  // in order to allow the '/api/auth/logout' to blacklist the refreshToken. In order
  // to get the session details, it makes the most sense to use the refreshToken.
  const refreshToken = req.cookies.refreshToken
  let decodedRefreshToken: string | jwt.JwtPayload

  if (!refreshToken || typeof refreshToken !== 'string') {
    // If the refreshToken is nonexistent, return a 401 response.
    // In practice, this should never happen because the route
    // is already protected by authMiddleware, in which case
    // it would preemptively return a 401 response.

    return res.status(401).json({
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Invalid `refreshToken`. Session data denied.',
      success: false
    })
  }

  try {
    // jwt.verify() will throw an error if the token is invalid.
    decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    )
  } catch (_err) {
    // If the refreshToken is invalid, return a 401 response.
    // Again, in practice this should never happen because the route
    // is already protected by authMiddleware, in which case
    // it would preemptively return a 401 response.

    return res.status(401).json({
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Invalid `refreshToken`. Session data denied.',
      success: false
    })
  }

  /* ======================
    RefreshTokenData Check
  ====================== */
  // In practice this 500 response should never happen. However,
  // it gives Typescript confidence that the jwt.JwtPayload is
  // specifically of type RefreshTokenData.

  if (!isRefreshTokenData(decodedRefreshToken)) {
    return res.status(500).json({
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'Session request failed at RefreshTokenData check.',
      success: false
    })
  }

  /* ======================
        Response
  ====================== */

  const session: Session = {
    id: decodedRefreshToken.id,
    role: decodedRefreshToken.role,
    sessionExp: decodedRefreshToken.exp,
    sessionIat: decodedRefreshToken.iat
  }

  return res.status(200).json({
    code: codes.OK,
    data: session,
    message: 'Success.',
    success: true
  })
}
