import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import User from 'models/userModel'
import {
  codes,
  isRefreshTokenData,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions
} from 'utils'
import { ResBody } from 'types'

/* ========================================================================
                                  logOut()
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Logout should be idempotent and not require authentication.
//
// ⚠️ What to do if there's no token in cookies?
//
// If there's no token in cookies, this could be a bug in the client-side logic
// such that the request is failing to include the cookie. If using
// Apollo Sandbox, this happens when one fails to toggle the 'Include Cookies'
// switch to on in the settings. It could also happen if the user decides to
// manually clear the cookies.
//
// So... should no token be considered a 400 error? Generally, it's not considered
// a 400 error. Why success makes sense:
//
//   - Idempotent behavior: Logout should be idempotent - calling it multiple times should have the
//     same result. If there's no token, the user is already in the desired state (logged out).
//
//   - Better user experience: Users won't see confusing error messages if they accidentally trigger logout
//     twice or if there are race conditions between multiple tabs/devices.
//
//   - Semantic correctness: The user's intent is "make me logged out" - and they already are. Mission accomplished.
//
/////////////////////////
//
// https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=10
// Dave Gray mentions at 23:10 that you have to pass in all of the same options when clearing the cookie.
// The cookie options MUST MATCH those that it was originally sent with. Some people instead do:
// res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
//
// Do the cookie options need to match exactly? Yes, but with a caveat:
//
//   The options that define the scope of the cookie—like path, domain, secure, and sameSite
//   — must match between res.cookie and res.clearCookie (or res.cookie with an expired date).
//
//   The value and expiration (maxAge or expires) do not need to match. In fact, you want
//   them to be different when clearing the cookie!
//
///////////////////////////////////////////////////////////////////////////

export const logOut = async (req: Request, res: Response<ResBody<null>>) => {
  /* ======================
  Attempt To Blacklist refreshToken
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // No refreshToken cookie will get sent from the client if it has already expired.
  // However, if it IS sent then you definitely want to use jwt.verify() and NOT jwt.decode().
  //
  // Note: in some cases, a user is first deleted and then logged out (during account cancellation).
  // For that reason, we have to assume that there may not be a user.
  //
  ///////////////////////////////////////////////////////////////////////////

  const refreshToken = req.cookies.refreshToken

  if (refreshToken) {
    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      )

      if (isRefreshTokenData(decodedRefreshToken)) {
        const userId = decodedRefreshToken.id

        const user = await User.findById(userId).select(
          '+refreshTokenBlacklist'
        )

        if (user) {
          ///////////////////////////////////////////////////////////////////////////
          //
          // Clean Up Expired Tokens (Optional):
          // This is more of a micro-optimization that keeps user.refreshTokenBlacklist tidy in real-time.
          // The real cleanup happens in a cron job. Is it redundant? Should we "double up or DRY up"?
          // This is operation is not strictly necessary, but it's nice to have. Similar logic also
          // exists in the refreshAccessToken() controller.
          //
          ///////////////////////////////////////////////////////////////////////////

          user.refreshTokenBlacklist = user.refreshTokenBlacklist.filter(
            (entry) => entry.expiresAt.getTime() > Date.now()
          )

          if (decodedRefreshToken.jti && decodedRefreshToken.exp) {
            user.refreshTokenBlacklist.push({
              jti: decodedRefreshToken.jti,
              // decodedRefreshToken.exp is the JWT expiration time, which is a UNIX timestamp in seconds.
              // JavaScript Date expects a timestamp in milliseconds since the Unix epoch.
              expiresAt: new Date(decodedRefreshToken.exp * 1000)
            })
          }

          await user.save()
        }
      }
    } catch (_err) {
      // The refresToken is invalid, nothing to blacklist, just continue to unsetting cookies.
    }
  }

  /* ======================
        Unset Cookies
  ====================== */

  const accessTokenCookieOptions = getAccessTokenCookieOptions()
  res.clearCookie('accessToken', {
    ...accessTokenCookieOptions,
    maxAge: 0
  })

  // Note: the refreshToken cookie is scoped to path: '/api/auth/refresh-token'.
  // However, the browser doesn't need to send the cookie for the server to clear it.
  const refreshTokenCookieOptions = getRefreshTokenCookieOptions()
  res.clearCookie('refreshToken', {
    ...refreshTokenCookieOptions,
    maxAge: 0
  })

  /* ======================
          Response
  ====================== */

  return res.status(200).json({
    code: codes.OK,
    data: null,
    message: 'Log out successful.',
    success: true
  })
}
