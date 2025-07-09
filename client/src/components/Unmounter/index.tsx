import { useState, useEffect } from 'react'

interface IUnmounter {
  children: any
  remountDelay?: number
  shouldRemount?: boolean
  show: boolean
  unmountDelay?: number
}

/* ========================================================================
                                Unmounter
======================================================================== */

export const Unmounter = ({
  children,
  remountDelay = 100,
  shouldRemount = false,
  show = false,
  unmountDelay = 1000
}: IUnmounter) => {
  const [shouldUnmount, setShouldUnmount] = useState(false)

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    let timeout: any

    if (show === false) {
      timeout = setTimeout(async () => {
        setShouldUnmount(true)

        if (shouldRemount === true) {
          await new Promise((resolve) => setTimeout(resolve, remountDelay))
          setShouldUnmount(false)
        }
      }, unmountDelay)
    } else {
      setShouldUnmount(false)
      clearTimeout(timeout)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [remountDelay, show, shouldRemount, unmountDelay])

  /* ======================
          return
  ====================== */

  return shouldUnmount ? null : children
}
