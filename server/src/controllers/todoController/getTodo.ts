import { Request, Response /*, NextFunction */ } from 'express'
import { ObjectId } from 'mongodb'
import Todo from 'models/todoModel'
import { codes, handleServerError } from 'utils'
import { ResBody, Todo as TodoType } from 'types'

/* ========================================================================
                                 getTodo()
======================================================================== */

export const getTodo = async (
  req: Request,
  res: Response<ResBody<TodoType | null>>
) => {
  const userId = req.user?._id
  const { id: todoId } = req.params

  /* ======================
  -      todoId Check
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
      message: `The ObjectId format is invalid.`,
      success: false
    })
  }

  try {
    // Approach 1:
    // const result = await Todo.find({ _id: id }).lean().exec()
    // const todo = result?.[0]

    // Approach 2:
    // The docs specifically say if you're querying by _id, use findById() instead.
    // const todo = await Todo.findOne({ _id: id }).lean().exec()

    // Note: The `password`, `role` and `refreshTokenBlacklist` are omitted by default from
    // the userModel. Technically, we don't need to deselect them here. but, it doesn't hurt.
    const todo = await Todo.findById(todoId)
      .populate({
        path: 'user',
        select: { password: 0, refreshTokenBlacklist: 0, role: 0 }
      })
      .lean()
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
    // ⚠️ It's crucial that you do an existence check first. Otherwise, this error will also be
    // triggered when the resource is not found, which ends up leading to confusion on the client.
    // That said, it seems unlikely that userId and the todo.user would be different at this point.
    //
    // 403 is actually the correct status code because the user does have
    // authetication credentials, but those credentials do not authorize them
    // to interact with this recource.
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

    return res.status(200).json({
      code: codes.OK,
      data: todo,
      message: 'Request successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
