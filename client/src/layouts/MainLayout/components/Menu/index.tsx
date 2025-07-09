'use client'

import { useAppContextSelector } from 'contexts'
import { Navicon } from 'components'
import { CustomOffCanvas } from './CustomOffCanvas'

/* ========================================================================
                                Menu
======================================================================== */
// AppProvider and AuthProvider are implemented inside of RootLayout, which
// means this is the first place we can clearactually consume those contexts.

export const Menu = () => {
  const showMenu = useAppContextSelector('showMenu')
  const setShowMenu = useAppContextSelector('setShowMenu')

  /* ======================
          return
  ====================== */

  return (
    <>
      {/* This container has a height of 0px, is fixed to top of the viewport,
      constrains Navicon within 2xl:container (inner). */}
      <div
        className='fixed w-full'
        //! style={{ zIndex: 9998 }}
      >
        <div className='relative mx-auto 2xl:container'>
          <Navicon
            data-toggle='offcanvas'
            onClick={() => setShowMenu((v) => !v)}
            iconClassName={`text-blue-500 dark:text-(--dark-primary-color)`}
            show={showMenu}
            style={{ position: 'absolute', top: 10, right: 10 }}
          />
        </div>
      </div>

      <CustomOffCanvas
        duration={200} // Should match duaration of throttledShowMenu (AKA showMenu).
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
    </>
  )
}
