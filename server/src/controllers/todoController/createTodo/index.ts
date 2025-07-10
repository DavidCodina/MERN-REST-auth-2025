import { Request, Response, NextFunction } from 'express'

import Todo from 'models/todoModel'
import { codes, getZodErrors, handleServerError } from 'utils'
import { CreateTodoSchema } from './CreateTodoSchema'
import { ResBody, Todo as TodoType } from 'types'

/* ========================================================================
                                 createTodo()
======================================================================== */

export const createTodo = async (
  req: Request,
  res: Response<ResBody<TodoType | null>>,
  _next: NextFunction
) => {
  const userId = req.user?._id
  const { title, body } = req.body

  ///////////////////////////////////////////////////////////////////////////
  //
  // Regarding Authentication:
  //
  // If there is no userId, then this will already have been handled by
  // the authMiddleware, which is attached in the route file. Thus,
  // we would've never gotten this far and therefore don't need to do anything
  // like this here:
  //
  //   if (!userId) {
  //     return res.status(400).json({
  //       data: null,
  //       message: 'The user must be authenticated to perform this operation.',
  //       success: false
  //     })
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////

  /* ======================
          Validation
    ====================== */

  const validationResult = CreateTodoSchema.safeParse({
    title,
    body
  })

  // Leverage the discriminated union.
  // Prior to this, validationResult.data is ?.
  if (!validationResult.success) {
    // At this point, we know that there are errors, and getZodErrors()
    // ALWAYS return an object. This pretty much guarantees that there
    // will be at least one property in formErrors - unless something
    // very unexpected happens in the getZodErrors() utility.
    const errors = getZodErrors(validationResult.error)

    return res.status(400).json({
      code: codes.FORM_ERRORS,
      data: null,
      errors: errors,
      message: 'The form data is invalid.',
      success: false
    })
  }

  // At this point data is assured.
  const validated = validationResult.data

  /* ======================
          Create Todo
    ====================== */

  try {
    // The more verbose approach would be to do:
    // const todo = new Todo({ title, body })
    // await todo.save()

    // I'm pretty sure that create() can also be used to pass an array of documents.
    // 2nd arg is options. 3rd arg is a callback. I prefer not to use the callback.
    // Note: the userId is a string, but Mongoose will typecast
    const newTodo = await Todo.create({
      title: validated.title,
      body: validated.body || '',
      user: userId
    })

    await newTodo.populate({
      path: 'user',

      // Note: The `password`, `role` and `refreshTokenBlacklist` are omitted by default from
      // the userModel. Technically, we don't need to deselect them here. but, it doesn't hurt.
      select: { password: 0, refreshTokenBlacklist: 0, role: 0 }
    })

    return res.status(201).json({
      code: codes.CREATED,
      data: newTodo,
      message: 'Resource created.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
