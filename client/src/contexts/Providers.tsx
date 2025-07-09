import * as React from 'react'
import { AppProvider, AuthProvider, ThemeProvider } from 'contexts'

/* ========================================================================
             
======================================================================== */

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </AppProvider>
  )
}
