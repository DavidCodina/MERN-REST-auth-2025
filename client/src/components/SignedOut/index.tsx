'use client'

import * as React from 'react'
import { useAuthContext } from 'contexts'

/* ========================================================================

======================================================================== */

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext()
  return !isAuthenticated ? children : null
}
