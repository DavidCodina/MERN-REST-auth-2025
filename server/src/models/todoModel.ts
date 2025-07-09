import { model, Schema } from 'mongoose'
import { Todo } from '../types'

/* ======================
-     todoSchema
====================== */

const todoSchema = new Schema<Todo>(
  {
    title: {
      type: String,
      required: true,
      // For this project, we don't necessarily want the title be unique
      // at the database-level. However, we can create logic in the create and update
      // resolvers that checks for uniqueness relative to THAT USER's other todos.
      unique: false
    },
    body: String,
    completed: {
      type: Boolean,
      default: false
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const Todo = model('Todo', todoSchema)
export default Todo
