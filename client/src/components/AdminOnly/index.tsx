'use client'

import * as React from 'react'
import { useAuthContext } from 'contexts'

/* ========================================================================

======================================================================== */
// Similar to the Clerk <Protect /> : https://clerk.com/docs/components/protect
// See also Code with Antonio at 6:34:30 of : https://www.youtube.com/watch?v=1MTyCvS05V4&t=1s
// He creates a client component called RoleGate that is used as a wrapper around other
// comnponents. That component either returns children or an Alert message.

export const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthContext()

  const isAdmin =
    session &&
    typeof session === 'object' &&
    typeof session.role === 'string' &&
    session.role.toLowerCase() === 'admin'

  return isAdmin ? children : null
}
