import { Request, Response, NextFunction } from 'express'
import Todo from 'models/todoModel'
import { codes, handleServerError } from 'utils'
import { ResBody, Todo as TodoType } from 'types'

/* ========================================================================
                                 getTodos()
======================================================================== */
//# Create a paginatedTodos based off of what was done in the GraphQL project.

export const getTodos = async (
  req: Request,
  res: Response<ResBody<TodoType[] | null>>,
  _next: NextFunction
) => {
  const userId = req.user?._id

  try {
    //# Add this part: .sort({ createdAt: -1 })
    const todos = await Todo.find({ user: userId })
      // For more info on populate() see here:
      // https://www.udemy.com/course/mongodb-4-complete-course/learn/lecture/24258128#overview
      .populate({ path: 'user', select: { password: 0, role: 0 } })
      .lean()
      .exec()

    // Simple demo with/without .where() for a regex query:

    // Simple demo with/without .where() for a regex query:
    // const todos = await Todo.find({ title: { $regex: /^Todo /i } })
    // const todos = await Todo.find().where('title').regex(/^Todo 1/i)

    // mongoose will send back an empty array if there are no todos.
    // It's unlikely that !todos will ever occur, but just in case.
    // If you want it to error when it's an empty array, then do this instead:
    // || (Array.isArray(todos) && todos.length === 0)
    if (!todos) {
      return res.status(404).json({
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    return res.status(200).json({
      code: codes.OK,
      data: todos,
      message: 'Request successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
