import { Request, Response, NextFunction } from 'express'
import { Role } from 'types'

/* ========================================================================
                            roleMiddleware()           
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Example usage:
//
// app.get('/api/admin', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
//     return res.status(200).json({
//       data: {}, message: 'You accessed the admin route.', success: true })
//   }
// )
//
///////////////////////////////////////////////////////////////////////////

const roleMiddleware = (allowedRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    let hasRole = false

    if (!userRole) {
      // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
      // 400 Bad Request is the status code to return when the form of the
      // client request is not as the API expects.
      return res.status(400).json({
        data: null,
        message: 'Either no user or no role was found.',
        success: false
      })
    }

    if (userRole !== allowedRole) {
      // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
      // 403 Forbidden is the status code to return when a client has valid credentials,
      // but not enough privileges to perform an action on a resource.
      return res.status(403).json({
        data: null,
        message:
          'The user lacks the requisite permission for this request (Forbidden).',
        success: false
      })
    }

    // Otherwise continue to the next middleware (or route controller).
    next()
  }
}

export default roleMiddleware
