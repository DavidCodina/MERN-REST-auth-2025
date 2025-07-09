import { Router } from 'express'
const router = Router()

import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
} from 'controllers/todoController'

import authMiddleware from 'middleware/authMiddleware'
// This approach applies the authMiddlware to to all routes below
// To test authorization, use the Headers tab in Postman to add
// Authorization: Bearer <token>.
router.use(authMiddleware)

router
  .route('/')
  .get(getTodos)

  .post(createTodo)
  .patch(updateTodo)
  .delete(deleteTodo)

// Notice how this forces us to use req.params.id (or use req.user.id)
// Thus, even though I often prefer putting ALL info in req.body, it's not
// always possible.
router.get('/:id', getTodo)

export default router
