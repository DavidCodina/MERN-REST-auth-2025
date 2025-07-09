import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from 'models/userModel'

/* ========================================================================
                            userMiddleware()         
======================================================================== */
// Middleware that attempts to get the user if there is one, but doesn't protect the endpoint.
// ⚠️ The critically important part here is that it's still using jwt.verify() and not merely
// using jwt.decode() without rejecting an invalid token. On the other hand, it's not sending
// back a 401 if the token is invalid.

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken

  if (accessToken && typeof accessToken === 'string') {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      async (err, decoded) => {
        // What happens here...

        // Ignore this part for now.
        if (!err && decoded && typeof decoded === 'object' && 'id' in decoded) {
          const userId = decoded.id
          const user = await User.findById(userId, '-password').lean().exec()
          if (user) {
            req.user = user
          }
        }
        next()
      }
    )
  } else {
    next()
  }
}

export default userMiddleware
