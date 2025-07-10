import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'

import Todo from 'models/todoModel'
import { codes, getZodErrors, handleServerError } from 'utils'
import { UpdateTodoSchema } from './UpdateTodoSchema'
import { ResBody, Todo as TodoType } from 'types'

/* ========================================================================
                                updateTodo()
======================================================================== */
//# 2025 : I'm still not sure why I am not passing id in the req.params.

//# In this case, I'm hiding the id inside of the request body, rather than
//# exposing it in the URL. Ask AI if this is a good idea.

export const updateTodo = async (
  req: Request,
  res: Response<ResBody<TodoType | null>>,
  _next: NextFunction
) => {
  const userId = req.user?._id
  const { id: todoId, title, body, completed } = req.body

  /* ======================
         ID Check
  ====================== */

  if (!todoId) {
    return res.status(400).json({
      code: codes.BAD_REQUEST,
      data: null,
      message: `The resource 'id' is required.`,
      success: false
    })
  }

  /* ======================
        ObjectId Check
  ====================== */

  if (!ObjectId.isValid(todoId)) {
    return res.status(400).json({
      code: codes.BAD_REQUEST,
      data: null,
      message: 'Invalid ObjectId.',
      success: false
    })
  }

  try {
    const todo = await Todo.findById(todoId)

      // Note: The `password`, `role` and `refreshTokenBlacklist` are omitted by default from
      // the userModel. Technically, we don't need to deselect them here. but, it doesn't hurt.
      .populate({
        path: 'user',
        select: { password: 0, refreshTokenBlacklist: 0, role: 0 }
      })
      // Omit .lean() because we'll call .save() later.
      .exec()

    /* ======================
          Existence Check
    ====================== */

    if (!todo) {
      return res.status(404).json({
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    /* ======================
        Authorization Check
    ====================== */

    ///////////////////////////////////////////////////////////////////////////
    //
    // Owner Authorization Check:
    //
    // 403 is actually the correct status code because the user does have
    // authetication credentials, but those credentials do not authorize them
    // to interact with this resource. You definitely don't want to send back
    // a 401, because this will trigger the client to request a new accessToken.
    //
    // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
    //
    // Gotcha: Originally the conditional check was todo.user.toString() !== userId
    // However, because we populated todo.user above, we need to do this instead:
    //
    //  todo.user._id.toString() !== userId
    //
    ///////////////////////////////////////////////////////////////////////////
    if (!userId?.equals(todo.user._id)) {
      return res.status(403).json({
        code: codes.FORBIDDEN,
        data: null,
        message: 'Only the resource owner may make this request.',
        success: false
      })
    }

    /* ======================
          Validation
    ====================== */

    const validationResult = UpdateTodoSchema.safeParse({
      title,
      body,
      completed
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
        message: 'There were one or more form errors.',
        success: false
      })
    }

    // At this point data is assured, but any given field may be undefined.
    const validated = validationResult.data

    /* ======================

    ====================== */

    if (typeof validated.title === 'string') {
      todo.title = validated.title
    }

    if (typeof validated.body === 'string') {
      todo.body = validated.body
    }

    if (typeof validated.completed === 'boolean') {
      todo.completed = completed
    }

    /* const _updatedTodo = */ await todo.save()

    return res.status(200).json({
      code: codes.UPDATED,
      data: todo,
      message: `Resource updated.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
