import ReactDom from 'react-dom'
import React, { useRef, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

// Custom imports
import { ModalCloseButton } from './ModalCloseButton'
import { stopEvents, createModalRoot, removeModalRoot } from './utils' // I'm not really sure what this does.
import { IModal } from './types'
import './styles.css'

/* =============================================================================
                                  Modal
============================================================================= */
//# Modal now works reasonably well with dark mode, but ultimately,
//# we want to move as many styles as possible into the components using
//# Tailwind classes. Why? Because the CSS styles always overwrite Tailwind.

////////////////////////////////////////////////////////////////////////////////
//
// Modal has three ways to render into the DOM.
//
// - It can render as is, just as any other component would.
// - A portalId can be provided, and that will be used to portal into.
//   This assumes the App has added the associated element already in index.html.
// - An id string can be passed to createPortalWithIdOf prop. That value will then
//   be used to dynamically generate a modalRoot to portal into prior to render.
//
// Note: if portalId & createPortalWithIdOf props are both passed, portalId will be used.
//
////////////////////////////////////////////////////////////////////////////////

export function Modal({
  addCloseButton = false,
  centered = true,
  children,
  fullscreen = false,
  modalClassName = '',
  modalDialogClassName = '',
  modalContentClassName = '',

  modalStyle = {},
  modalDialogStyle = {},
  modalContentStyle = {},

  // react-bootstrap uses an onHide prop. reactstrap uses toggle prop.
  // It doesn't really make sense to have a toggle prop because all
  // you'll ever be doing is closing it. Thus, onClose is used instead.
  onClose,
  portalId: portalIdProp = '',
  createPortalWithIdOf = '',
  scrollable = true,
  shouldAnimate = true,
  shouldShowBackdrop = true,
  // react-bootstrap uses a show prop. reactstrap uses isOpen prop.
  // I prefer show, but alias it with isOpen internally.
  show: isOpen = false,
  size,
  ...otherProps // Currently, this is just id.
}: IModal) {
  /* ======================
        state & refs
  ====================== */

  const modalRef = useRef<HTMLDivElement | null>(null)
  const modalContentRef = useRef<HTMLDivElement | null>(null)
  const firstRenderRef = useRef(true)

  // Should this be hardcoded? Note that this corresponds to the
  // animation durations that are hardcoded in the CSS. For now,
  // I'm okay with it all being hardcoded.
  const animationTime = 1000

  // On mount set portalId to portalIdProp or the value of createPortalWithIdOf
  const [portalId] = useState(() => {
    if (
      createPortalWithIdOf &&
      typeof createPortalWithIdOf === 'string' &&
      !portalIdProp
    ) {
      return createModalRoot(portalIdProp, createPortalWithIdOf)
    }
    return portalIdProp
  })

  /* ======================
      getModalClasses()
  ====================== */

  const getModalClasses = () => {
    // Bootstrap and reactstrap use 1055. However, the Navicon uses 9998 to sit one
    // below react-toastify. In order to prevent clicking on the navicon while the modal
    // is open, I've upgraded this to also be 9998.
    let classes = 'xx-modal z-[9998]'

    if (!shouldShowBackdrop) {
      classes = `${classes} xx-animation-none`
    }

    if (!shouldAnimate) {
      classes = `${classes} xx-animation-duration-0`
    }

    if (modalClassName) {
      classes = `${classes} ${modalClassName}`
    }

    return classes
  }

  /* ======================
  getModalDialogClasses()
  ====================== */

  const getModalDialogClasses = () => {
    let classes = 'xx-modal-dialog'
    let fullScreenClass = ''
    let sizeClass = ''

    if (centered) {
      classes = `${classes} xx-modal-dialog-centered`
    }

    switch (fullscreen) {
      case true:
        fullScreenClass = 'xx-modal-fullscreen'
        break

      case 'sm':
        fullScreenClass = 'xx-modal-fullscreen-sm-down'
        break

      case 'md':
        fullScreenClass = 'xx-modal-fullscreen-md-down'
        break

      case 'lg':
        fullScreenClass = 'xx-modal-fullscreen-lg-down'
        break

      case 'xl':
        fullScreenClass = 'xx-modal-fullscreen-xl-down'
        break

      case 'xxl':
        fullScreenClass = 'xx-modal-fullscreen-xxl-down'
        break

      default:
        fullScreenClass = ''
    }

    if (fullScreenClass) {
      classes = `${classes} ${fullScreenClass}`
    }

    if (scrollable) {
      classes = `${classes} xx-modal-dialog-scrollable`
    }

    switch (size) {
      case 'sm':
        sizeClass = 'xx-modal-sm'
        break

      case 'lg':
        sizeClass = 'xx-modal-lg'
        break

      case 'xl':
        sizeClass = 'xx-modal-xl'
        break

      default:
        sizeClass = ''
    }

    if (sizeClass) {
      classes = `${classes} ${sizeClass}`
    }

    // If the user passed in a custom class
    if (modalDialogClassName) {
      classes = `${classes} ${modalDialogClassName}`
    }

    return classes
  }

  /* ======================
  getModalContentClassName()
  ====================== */

  const getModalContentClassName = () => {
    const base = `xx-modal-content bg-neutral-50 transition-colors duration-300 ease-linear rounded-xl${
      !shouldAnimate ? ' xx-animation-none' : ''
    }`

    const background = `bg-neutral-50 dark:bg-(--dark-bg-color)`
    const border = `border border-stone-300 dark:border-(--dark-primary-color)`
    const shadow = `
      shadow-[rgba(0,0,0,0.25)_0px_4px_8px_-1px,_rgba(0,0,0,0.3)_0px_2px_4px_-2px]
      dark:shadow-[rgba(0,0,0,0.75)_0px_4px_8px_-1px,_rgba(0,0,0,0.75)_0px_2px_4px_-2px]
    `

    const _className = twMerge(
      `${base} ${background} ${border} ${shadow}`,
      modalContentClassName
    )

    return _className
  }

  /* ======================
      handleModalClose()
  ====================== */
  // This is for closing the modal when a user clicks outside of the dialog.

  const handleModalClose = (
    e: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    // The outer if is to discriminate modal from modal dialog.
    // The function will work with the .btn-close button also as
    // long as there is no other elements inside of the close button.
    if (e?.currentTarget === e?.target) {
      if (typeof onClose === 'function') {
        stopEvents('click', 500)
        onClose?.()
      }
    }
  }

  /* ======================
        useEffect()
  ====================== */
  // Conditionally remove backdrop (on mount only). This can be done by removing the animation itself.
  // Notice that shouldAnimate is NOT intended to be updated dynamically.

  useEffect(() => {
    if (firstRenderRef.current !== true) {
      return
    }

    if (!modalRef.current) {
      return
    }

    // If shouldShowBackdrop is false, then add .animation-none.
    // This stops all animations from occuring on that elelment.
    if (shouldShowBackdrop === false) {
      modalRef.current.classList.add('xx-animation-none')
    }
  }, [shouldShowBackdrop])

  /* ======================
        useEffect()
  ====================== */
  // Conditionally add/remove various classes related to animating backdrop and modal (on mount only).
  // Notice that shouldAnimate is NOT intended to be updated dynamically.

  useEffect(() => {
    if (firstRenderRef.current !== true) {
      return
    }

    if (!modalRef.current || !modalContentRef.current) {
      return
    }

    // If animation is disabled, then do this.
    if (!shouldAnimate === true) {
      modalRef.current.classList.add('xx-animation-duration-0') // Prevent darkenBackground animation on mount.
      modalContentRef.current.classList.add('xx-animation-duration-0') // Prevent modalDown animation on mount.
      modalContentRef.current.classList.add('xx-animation-none') // This isn't really needed, but doesn't hurt.
      return
    }

    // If animation is enabled and isOpen is initially true, then do this.
    if (firstRenderRef.current === true && isOpen && shouldAnimate) {
      modalRef.current.classList.add('xx-animation-duration-0') // Prevent darkenBackground animation on mount.
      modalContentRef.current.classList.add('xx-animation-duration-0') // Prevent modalDown animation on mount.

      setTimeout(() => {
        if (!modalRef.current || !modalContentRef.current) {
          return
        }
        modalRef.current.classList.remove('xx-animation-duration-0')
        modalContentRef.current.classList.remove('xx-animation-duration-0')
      }, animationTime)
    }
  }, [shouldAnimate, isOpen])

  /* ======================
        useEffect()
  ====================== */
  // Conditionally open or close modal based on value of show/isOpen.

  useEffect(() => {
    let animationRemovalTimeout: NodeJS.Timeout

    // Classes are added by reaching into the DOM.
    // This isn't exactly the most 'React' (i.e. declarative)
    // way to do it, but it still works just fine.
    const toggleModal = () => {
      stopEvents('click', 500) // Call stopEvents() in either case.

      if (isOpen && modalRef.current) {
        modalRef.current.classList.remove('xx-animate-close')

        //^ The main shortcoming with this implementation is that if you have
        //^ nested modals, you will be unsetting the the scroll lock for them also.
        document.body.style.maxHeight = '100vh' // Helps prevent scrolling
        document.body.style.overflow = 'hidden'

        modalRef.current.classList.add('xx-animate-open')
        modalRef.current.classList.add('xx-modal-show')
      } else if (!isOpen && modalRef.current) {
        document.body.style.maxHeight = ''
        document.body.style.overflow = ''
        modalRef.current.classList.remove('xx-animate-open')
        modalRef.current.classList.add('xx-animate-close')

        if (shouldAnimate) {
          // Gotcha: The timeout has to be removed in the cleanup function.
          // Why? Because !isOpen is usually true on mount, which means this code
          // initially runs, and could potentially ruin an animation 1500ms later.

          animationRemovalTimeout = setTimeout(function () {
            // If the component unmounts for some reason before the timeout executes, an error will occur
            // because modalRef no longer exists. To protect against this, we need to first check for existence.
            if (modalRef.current) {
              modalRef.current.classList.remove('xx-modal-show')
              // Gotcha: Don't remove .xx-animate-close here.
              // It seems to break the animation of nested modals for some reason.
              // Instead, just allow it to be removed when isOpen.
              // modalRef.current.classList.remove('xx-animate-close')
            }
          }, animationTime)
        } else if (!shouldAnimate && modalRef.current) {
          modalRef.current.classList.remove('xx-modal-show')
        }
      }
    }

    toggleModal()

    return () => {
      clearTimeout(animationRemovalTimeout)
    }
  }, [isOpen, shouldAnimate])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() needs to be last.

  useEffect(() => {
    if (firstRenderRef.current === false) {
      return
    }
    firstRenderRef.current = false
  }, [])

  /* ======================
        useEffect()
  ====================== */
  // When the component unmounts, check the DOM for a potential
  // dynamically generated portal. If found, AND that element has
  // no other children, then remove it.

  useEffect(() => {
    return () => {
      // console.log('Unmounting component...')
      if (createPortalWithIdOf && typeof createPortalWithIdOf === 'string') {
        removeModalRoot(createPortalWithIdOf)
      }
    }
  }, [createPortalWithIdOf])

  /* ======================
          content
  ====================== */

  const renderModal = () => {
    const modal = (
      <div // eslint-disable-line
        className={getModalClasses()}
        onClick={handleModalClose}
        // eslint(jsx-a11y/click-events-have-key-events)
        // Visible, non-interactive elements with click
        // handlers must have at least one keyboard listener
        // onKeyDown={(_e) => { /* */}}
        ref={modalRef}
        // Bootstrap uses role='dialog', but that makes the linting freak out.
        // eslint(jsx-a11y/no-noninteractive-element-interactions)
        // It's kind of dopey to add role='button'. Plus this changes everything
        // to cursor:pointer. In this case, it's just easier to disable the linting on <div>
        role='dialog'
        style={modalStyle}
        tabIndex={-1} // Bootstrap does this
        {...otherProps}
      >
        <div className={getModalDialogClasses()} style={modalDialogStyle}>
          <div
            ref={modalContentRef}
            className={getModalContentClassName()}
            style={modalContentStyle}
          >
            {/* In cases where we are not using the ModalHeader, we can opt in to adding a close button. */}
            {addCloseButton && (
              <ModalCloseButton onClick={(e) => handleModalClose(e)} />
            )}

            {children}
          </div>
        </div>
      </div>
    )

    if (portalId && document.getElementById(portalId)) {
      return ReactDom.createPortal(
        modal,
        document.getElementById(portalId) as HTMLDivElement
      )
    } else if (portalId) {
      console.warn(
        `The Modal component received a portalId of '${portalId}', but there's no matching element in the DOM. Modal will use the standard rendering approach instead.`
      )
    }

    return modal
  }

  /* ======================
          return
  ====================== */

  return renderModal()
}
