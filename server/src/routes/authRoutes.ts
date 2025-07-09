import { Router } from 'express'
import {
  logIn,
  logOut,
  getSession,
  refreshAccessToken
} from 'controllers/authController'

import authMiddleware from 'middleware/authMiddleware'
const router = Router()

router.post('/login', logIn)

///////////////////////////////////////////////////////////////////////////
//
// Why POST for '/logout'?
// '/logout' should be idempotent and not require authentication.
//
//   - State Change: Logging out changes the server-side state
//     (e.g., invalidating tokens, clearing cookies). According
//     to RESTful conventions, GET should be safe and idempotent
//     (no side effects), while POST is for actions that change state.
//
//   - CSRF Protection: Browsers will preflight CORS and enforce CSRF
//     protections more strictly on POST requests. This helps prevent
//     malicious sites from triggering logouts via simple GET requests
//     (like an image tag).
//
//   - the action itself is a "command" rather than a "resource fetch,"
//     so POST fits better semantically.
//
///////////////////////////////////////////////////////////////////////////

router.post('/logout', logOut) // DO NOT put authMiddleware here.

router.get('/session', authMiddleware, getSession)
router.get('/refresh-token', refreshAccessToken)

export default router
