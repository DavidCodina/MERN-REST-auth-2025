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

    if (!userRole) {
      return res.status(403).json({
        data: null,
        message: 'Forbidden: Unable to determine user role.',
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
          'Forbidden: The user lacks the requisite permission for this request.',
        success: false
      })
    }

    // Otherwise continue to the next middleware (or route controller).
    next()
  }
}

export default roleMiddleware
