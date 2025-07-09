import { Request, Response, NextFunction } from 'express'
import { randomFail } from 'utils'

/* ========================================================================

======================================================================== */
// Example usage: app.use('/api', randomFailMiddleware, indexRoute)
// Inspired by Netflix Chaos Monkey.

export const randomFailMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shouldFail = randomFail()
  const isDev = process.env.NODE_ENV === 'development' ? true : false

  if (isDev && shouldFail) {
    return res.status(400).json({
      data: null,
      message: 'randomFailMiddleware triggered.',
      success: false,
      code: 'BAD_REQUEST'
    })
  }
  next()
}
