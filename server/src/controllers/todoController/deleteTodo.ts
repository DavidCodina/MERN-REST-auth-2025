import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import Todo from 'models/todoModel'

import { codes, handleServerError } from 'utils'
import { ResBody /* Todo as TodoType */ } from 'types'

/* ========================================================================
                                deleteTodo()
======================================================================== */
//# In this case, I'm hiding the id inside of the request body, rather than
//# exposing it in the URL. Ask AI if this is a good idea.

export const deleteTodo = async (
  req: Request,
  res: Response<ResBody<null>>,
  _next: NextFunction
) => {
  const { id: todoId } = req.body
  const userId = req.user?._id

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
    const todo = await Todo.findById(todoId).exec()

    /* ======================
        Existence Check
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // If there is no todo, then calling todo.deleteOne()
    // will cause an internal server error:
    //
    //   "TypeError: Cannot read properties of null (reading 'deleteOne')"
    //   For this reason, we check if the todo exists first.
    //
    ///////////////////////////////////////////////////////////////////////////

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
            Delete
    ====================== */

    // I think you can also just do: await Todo.deleteOne({ _id: id }),
    // but I prefer to break it up by attempting to findById(id) first.
    const _deleteResult = await todo.deleteOne() // { acknowledged: true, deletedCount: 1 }

    res.status(200).json({
      code: codes.DELETED,
      data: null,
      message: `The todo '${todo.title}' with an id of ${todo._id} has been deleted.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
