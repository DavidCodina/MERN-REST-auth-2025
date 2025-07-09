import { Request, Response, NextFunction } from 'express'
import { isValidObjectId } from 'mongoose'

///////////////////////////////////////////////////////////////////////////
//
// Based off of Traversy Ecommerce 2023 video 4.9.
// Checks if the req.params.id is a valid Mongoose ObjectId.
// Note: you can also do this kind of thing:
//
//   import { ObjectId } from 'mongodb'
//   if (!ObjectId.isValid(id)) { ... }
//
// Usage: router.route('/:id').get(objectIdMiddleware, getProduct)
//
///////////////////////////////////////////////////////////////////////////

export const objectIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      data: null,
      message: 'The ObjectId format is invalid.',
      success: false
    })
  }
  next()
}
