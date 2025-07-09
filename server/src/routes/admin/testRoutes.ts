import { Router } from 'express'
import { getAdmin } from 'controllers/admin/testController'

import authMiddleware from 'middleware/authMiddleware'
import roleMiddleware from 'middleware/roleMiddleware'

const router = Router()

/* ======================
        admin
====================== */

router.get('/', authMiddleware, roleMiddleware('ADMIN'), getAdmin)

export default router
