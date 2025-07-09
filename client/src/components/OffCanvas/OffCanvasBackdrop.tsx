import { ComponentProps } from 'react'
import { Portal } from 'components'

interface IOffCanvasBackdrop extends ComponentProps<'div'> {
  /** The (open/show) value of the OffCanvas. */
  value: boolean
  /** The time in milliseconds that the backdrop overlay's fade in/out animation should take. */
  backdropDuration: number
}

/* ========================================================================
                              OffCanvasBackdrop
======================================================================== */

export const OffCanvasBackdrop = ({
  backdropDuration,
  className = '',
  style = {},
  value,
  ...otherProps
}: IOffCanvasBackdrop) => {
  /* ======================
        getClassName()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // value (i.e., offCanvas's show/open.) is passed in the moment
  // it changes. This allows OffCanvasBackdrop to change to its
  // exit animation. Conversely, the showBackdrop state in the consuming
  // environment does not actually change until the necessary duration has
  // elapsed:
  //
  //   else if (value === false) {
  //     setTimeout(() => {  setShowBackdrop(false) }, backdropDuration)
  //   }
  //
  // In this way, the backdrop overlay's exit animation completes, and then
  // the Portal unmounts, removing all DOM nodes with it.
  //
  ///////////////////////////////////////////////////////////////////////////

  const getClassName = () => {
    let classes = ''

    if (value === true) {
      classes = 'offcanvas-backdrop offcanvas-bg-darken'
    } else {
      classes = 'offcanvas-backdrop offcanvas-bg-lighten'
    }

    if (className) {
      classes = `${classes} ${className}`
    }

    return classes
  }

  /* ======================
          return
  ====================== */

  return (
    <Portal>
      <div
        className={getClassName()}
        style={{
          animationDuration: `${backdropDuration}ms`,
          height: '100vh',
          left: '0',
          position: 'fixed',
          top: '0',
          width: '100vw',
          ///////////////////////////////////////////////////////////////////////////
          //
          // Bootstrap uses something like 1040. Ultimately, we want this to be:
          //
          //   - Below toast notifications (9999)
          //   - Below the .offcanvas (9998)
          //   - ✅ 9997
          //   - Above the Navicon (9996)
          //
          ///////////////////////////////////////////////////////////////////////////
          zIndex: '9997',
          ...style
        }}
        {...otherProps}
      />
    </Portal>
  )
}
