/** Custom error codes */
export const codes = {
  OK: 'OK',

  CREATED: 'CREATED',

  UPDATED: 'UPDATED',

  DELETED: 'DELETED',

  BAD_REQUEST: 'BAD_REQUEST',

  NOT_FOUND: 'NOT_FOUND',

  CONFLICT: 'CONFLICT',

  FORM_ERRORS: 'FORM_ERRORS',

  /** Use this as an opaque error code for all failed login attempts. */
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  /** Use this when authentication fails. */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /** Use this when authorization fails. This may be used for RBAC or when a
   * reources associated user id does not match the current user's id.
   */
  FORBIDDEN: 'FORBIDDEN',

  /** Use this when the user is ALREADY archived, not on succesfful update to arching the user. */
  USER_ARCHIVED: 'USER_ARCHIVED',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
} as const
