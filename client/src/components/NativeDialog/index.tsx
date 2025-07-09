'use client'

import { ComponentPropsWithRef, useRef, useEffect } from 'react'

import './index.css'

type NativeDialog = {
  show: boolean
} & ComponentPropsWithRef<'dialog'>

/* ========================================================================
                              NativeDialog     
======================================================================== */
// Ultimately, this isn't really much of an improvement on what we can do in React
// with a <div> and a little bit of logic, but it's still interesting.
//
//   Dave Gray:    https://www.youtube.com/watch?v=fwq9vePfwkI
//   Colby Fayock: https://www.youtube.com/watch?v=FSY2A0vzwko
//   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

//# Expose ref.
//# Add a thing that checks if it's open and if it is and there is a click outside
//# of the content container, then close it.

//# Add logic from Container component for min/max size.

export const NativeDialog = ({
  children,
  show,
  ...otherProps
}: NativeDialog) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) {
      return
    }

    if (show === true) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show])

  /* ======================
          return
  ====================== */

  return (
    <>
      <dialog
        data-native-dialog
        {...otherProps}
        ref={dialogRef}
        // By default the browser will set max-height and max-width to 100% - 38px.
        // Do not hardcode flex, block, etc. on <dialog>. The display property is used for showing.
        // In order to adjust the position of the dialog, we need to begin
        // by setting the margin to 0.
        className='fixed m-0 h-full max-h-full w-full max-w-full bg-transparent' // backdrop:bg-black/50
      >
        {/* This is the content wrapper. Currently, it's hardcoding the positioning, but that will fix soon. */}
        <div className='absolute top-1/2 left-1/2 flex -translate-x-2/4 -translate-y-2/4'>
          {children}
        </div>
      </dialog>
    </>
  )
}
