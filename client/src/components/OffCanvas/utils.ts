import { Dispatch, SetStateAction } from 'react'

/* ======================
      openOrClose()
====================== */

export const openOrClose = ({
  className,
  duration,
  placement,
  setOffCanvasClassName,
  value
}: {
  className: string
  duration: number
  placement: 'start' | 'end' | 'top' | 'bottom'
  setOffCanvasClassName: Dispatch<SetStateAction<string>>
  value: boolean
}) => {
  if (value === true) {
    setOffCanvasClassName(
      `offcanvas offcanvas-${placement} offcanvas-showing${
        className ? ` ${className}` : ''
      }`
    )
    setTimeout(() => {
      setOffCanvasClassName(
        `offcanvas offcanvas-${placement} offcanvas-show${
          className ? ` ${className}` : ''
        }`
      )
    }, duration)
  } else {
    setOffCanvasClassName(
      `offcanvas offcanvas-${placement} offcanvas-hiding${
        className ? ` ${className}` : ''
      }`
    )
    setTimeout(() => {
      setOffCanvasClassName(
        `offcanvas offcanvas-${placement}${className ? ` ${className}` : ''}`
      )
    }, duration)
  }
}

/* ======================
      onBodyClick()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Legacy implementation:
//
// Initially, I did this,
//
//   useEffect(() => {
//     if (disableBodyClick) { return }
//     const body = document.getElementsByTagName('body')[0]
//     const handleBodyClick = (e: MouseEvent) => {
//       onBodyClick({ offCanvasRef, onChangeRef, value, e })
//     }
//     body && body.addEventListener('click', handleBodyClick)
//     return () => { body && body.removeEventListener('click', handleBodyClick) }
//   }, [disableBodyClick, value])
//
// However, this is all verbose and convoluted.
// I swapped this out for a custom useOutsideClick() hook.
//
///////////////////////////////////////////////////////////////////////////

// export const onBodyClick = ({
//   offCanvasRef,
//   onChangeRef,
//   value,
//   e
// }: {
//   e: MouseEvent
//   offCanvasRef: MutableRefObject<HTMLDivElement | null>
//   onChangeRef: MutableRefObject<(newValue: boolean) => void>
//   value: boolean
// }) => {
//   // Return early if it's already closed or if no ref.
//   if (!value || offCanvasRef.current === null || e.target === null) {
//     return
//   }

//   ///////////////////////////////////////////////////////////////////////////
//   //
//   // Return early if user clicks on an element marked as data-toggle='offcanvas'
//   // The actual name of the data attribute could be exposed as a configurable prop...
//   // e.currentTarget will always be <body>.
//   // e.target will be whatever the user actually clicks on.
//   //
//   //   <Navicon1
//   //     onClick={() => setShowMenu((v) => !v)}
//   //     data-toggle='offcanvas'
//   //     iconClassName={`text-blue-500 dark:text-[var(--dark-primary-color)]`}
//   //     show={showMenu}
//   //     style={{ position: 'absolute', top: 10, right: 10 }}
//   //   />
//   //
//   // https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
//   // It'possible that the element will be obscured by whatever is in front of it.
//   // In other words, if there's child elements in a button, they will obscure the
//   // actual button element. The simplest solution is to use something like:
//   // .custom-toggle-button * { pointer-events: none; }
//   //
//   // As an added precaution here we can also check for the parentElement and the
//   // parentElement.parentElement for the data attribute. If your toggler has more nested elements
//   // than that, it's advisable to add data-toggle='offcanvas' those child elements.
//   //
//   ///////////////////////////////////////////////////////////////////////////
//   const target = e?.target as HTMLElement

//   ///////////////////////////////////////////////////////////////////////////
//   //
//   // Why all the ? ? Because in some cases we may want to do this:
//   //
//   //   const body = document.getElementsByTagName('body')[0]
//   //   body?.click()
//   //
//   // And in that case, one or more of the conditions will break.
//   //
//   ///////////////////////////////////////////////////////////////////////////

//   if (
//     target?.getAttribute('data-toggle') === 'offcanvas' ||
//     target?.parentElement?.getAttribute('data-toggle') === 'offcanvas' ||
//     target?.parentElement?.parentElement?.getAttribute('data-toggle') ===
//       'offcanvas'
//   ) {
//     // console.log('Returning early because user clicked the toggler.')
//     return
//   }

//   // Similar logic for OffCanvas menu.
//   if (
//     offCanvasRef.current === target ||
//     //  (offCanvasRef as HTMLDivElement).contains
//     offCanvasRef.current.contains(target /*as Node */)
//   ) {
//     // console.log('Returning early because user clicked the offcanvas menu.')
//     return
//   }

//   // In all other cases close the menu.
//   onChangeRef.current?.(false)
// }

/* ======================
      addBackdrop()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Legacy implementation:
//
// Initially, I did this, which actually works fine, but the
// Portal approach is preferable.
//
//   useEffect(() => {
//     if (disableBackdrop) { return }
//     if (offCanvasRef.current === null) {
//       removeBackdrop({ backdropDuration })
//       return
//     }
//     addBackdrop({ backdropDuration, disableScrollLock, offCanvasRef, value })
//     return () => { removeBackdrop({ backdropDuration }) }
//   }, [backdropDuration, disableBackdrop, disableScrollLock, value])
//
///////////////////////////////////////////////////////////////////////////

// export const addBackdrop = ({
//   backdropDuration,
//   disableScrollLock,
//   value,
//   offCanvasRef
// }: {
//   backdropDuration: number
//   disableScrollLock: boolean
//   offCanvasRef: MutableRefObject<HTMLDivElement | null>
//   value: boolean
// }) => {
//   const body = document.getElementsByTagName('body')[0]

//   if (offCanvasRef.current === null) {
//     console.log('offCanvasRef.current', offCanvasRef.current)

//     return
//   }

//   if (value === true) {
//     const backdrop = document.createElement('div')
//     // The className is just used as an identifier.
//     // There is no CSS, SCSS, or styled component logic that uses it.
//     backdrop.className = 'offcanvas-backdrop offcanvas-bg-darken'
//     // The z-index below just needs to be lower than the SCOffCanvas, which is currently 1045.
//     // https://stackoverflow.com/questions/3968593/how-can-i-set-multiple-css-styles-in-javascript
//     backdrop.style.cssText = `
//       animation-duration: ${backdropDuration}ms;
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100vw;
//       height: 100vh;
//       z-index: 1040;
//     `
//     if (offCanvasRef.current.parentElement) {
//       offCanvasRef.current.parentElement.appendChild(backdrop)
//     }

//     // Prevent scrolling of the content area when the backdrop is active
//     if (!disableScrollLock && body) {
//       body.style.overflow = 'hidden'
//     }
//   }
// }

/* ======================
    removeBackdrop()
====================== */
// Legacy implementation

// export const removeBackdrop = ({
//   backdropDuration
// }: {
//   backdropDuration: number
// }) => {
//   const body = document.getElementsByTagName('body')[0]

//   const backdrops = document.getElementsByClassName('offcanvas-backdrop')

//   for (let i = 0; i < backdrops.length; i++) {
//     const backdrop = backdrops?.[i]
//     // backdrop.remove()
//     if (!backdrop) {
//       continue
//     }

//     backdrop.classList.remove('offcanvas-bg-darken')
//     backdrop.classList.add('offcanvas-bg-lighten')

//     setTimeout(() => {
//       if (backdrop.parentNode) {
//         backdrop.parentNode.removeChild(backdrop)
//       }
//     }, backdropDuration)
//   }

//   if (body) {
//     body.style.overflow = ''
//   }
// }
