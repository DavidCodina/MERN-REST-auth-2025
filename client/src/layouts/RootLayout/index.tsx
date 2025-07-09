import { Outlet } from 'react-router'

import { Providers } from 'contexts'

/* ========================================================================
                              RootLayout                      
======================================================================== */

export const RootLayout = () => {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}

export default RootLayout
