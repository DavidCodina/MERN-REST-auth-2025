import { Router } from 'express'
import {
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  softDeleteUser
} from 'controllers/userController'
import authMiddleware from 'middleware/authMiddleware'

const router = Router()
router.post('/', createUser) // AKA register
router.get('/current', authMiddleware, getCurrentUser)
router.patch('/', authMiddleware, updateUser)
router.patch('/soft-delete', authMiddleware, softDeleteUser)
router.delete('/', authMiddleware, deleteUser)

export default router
