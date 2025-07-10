import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { codes } from 'utils'
import User from 'models/userModel'
import { ResBody } from 'types'

/* ========================================================================
                            authMiddleware()           
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Example usage:
//
//   app.get('/api/protected', authMiddleware, async (req, res) => {
//     return res.status(200).json({ data: {}, message: 'You accessed the protected route.', success: true })
//   })
//
///////////////////////////////////////////////////////////////////////////

const authMiddleware = (
  req: Request,
  res: Response<ResBody<null>>,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken

  ///////////////////////////////////////////////////////////////////////////
  //
  // If a cookie is expired (i.e., its expires or maxAge is in the past), the
  // browser will automatically remove it. An expired cookie will NOT be sent
  // to the server on any request. This is true for both browser environments
  // and tools like Postman.
  //
  // If the accessToken cookie is expired, it will NOT show up in req.cookies on
  // the server, because the browser (or Postman) doesn't send expired cookies.
  // When a cookie expires, it is deleted from the client.
  //
  // However, when a cookie expires, the browser will NOT immediately remove it from the Application tab.
  // Why? The cookie storage UI in dev tools is not "live"—it doesn't poll for expiry.
  // The cookie is only purged from the UI when the browser checks the cookie store (usually on a new request or reload).
  // The cookie will still be visible in the list until you:
  //
  //   - Refresh the page
  //   - Navigate to a new page
  //   - Trigger any network request to the same domain/path
  //
  ///////////////////////////////////////////////////////////////////////////

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(401).json({
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'No accessToken. Authentication failed.',
      success: false
    })
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!,
    async (err, decoded) => {
      if (err) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
        // 401 Unauthorized is the status code to return when the client
        // provides no credentials or invalid credentials.
        //
        // Dave Gray uses 403 at 26:25 of https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=10
        // I think that is incorrect.
        //
        ///////////////////////////////////////////////////////////////////////////
        return res.status(401).json({
          code: codes.UNAUTHORIZED,
          data: null,
          message: 'Invalid `accessToken`.',
          success: false
        })
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // The naive approach would be to attach decoded to req.user.
      //
      //  req.user = decoded as Request['user']
      //
      // However, if a user updated their info then the data from decoded could be stale
      // until the next time the user logged in. For this reason, it's a better practice
      // to use the decoded._id to get the user directly from the database every time.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (decoded && typeof decoded === 'object' && 'id' in decoded) {
        const userId = decoded.id

        // The `password`,  `refreshTokenBlacklist` and `role` are omitted
        // from the userModel by default. However, we do want role.
        const user = await User.findById(userId, '+role').lean().exec()

        if (!user) {
          return res.status(401).json({
            code: codes.UNAUTHORIZED,
            data: null,
            message: 'Authentication failed: unable to find user.',
            success: false
          })
        }

        req.user = user
      } else {
        return res.status(401).json({
          code: codes.UNAUTHORIZED,
          data: null,
          message: 'Authentication failed: data missing from decoded cookie.',
          success: false
        })
      }
      next()
    }
  )
}

export default authMiddleware
