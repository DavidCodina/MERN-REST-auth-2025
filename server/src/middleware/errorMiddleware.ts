import { Request, Response, NextFunction } from 'express'
// Based off of Traversy Ecommerce 2023 video 4.9.

/* ======================
      notFound()
====================== */
// Fallback for 404 errors

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Not Found: ${req.originalUrl}`)
  res.status(404)
  next(err)
}

/* ======================
      errorHandler()
====================== */

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500
  const message = err?.message

  return res.status(statusCode).json({
    data: null,
    message: message,
    // Sending '🥞' is just for fun. Really, you'd probably want to send null.
    stack: process.env?.NODE_ENV === 'production' ? '🥞' : err?.stack,
    success: false
  })
}
