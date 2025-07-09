import { useLayoutEffect, useRef, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { IRadixModal } from './types'

const closeIcon = (
  <svg style={{ height: '1.5em' }} viewBox='0 0 15 15' fill='none'>
    <path
      d='M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z'
      fill='currentColor'
      fillRule='evenodd'
      clipRule='evenodd'
    ></path>
  </svg>
)

/* ========================================================================
                                RadixModal
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Docs:
//
//   https://www.radix-ui.com/primitives/docs/components/dialog
//
// Sam Selikoff tutorials:
//
//   https://www.youtube.com/watch?v=KvZoBV_1yYE
//   https://www.youtube.com/watch?v=3ijyZllWBwU
//   https://www.youtube.com/watch?v=VM6YRrUsnUY
//   https://github.com/samselikoff/2023-05-30-radix-dialog/tree/main/03-reusable-component/end/app
//   https://github.com/samselikoff/2023-05-30-radix-dialog/blob/main/03-reusable-component/end/app/spinner.tsx
//
// Keyboard Interactions:
//
//   Space       : Opens/closes the dialog.
//   Enter       : Opens/closes the dialog.
//   Tab         : Moves focus to the next focusable element.
//   Shift + Tab : Moves focus to the previous focusable element.
//   Esc         : Closes the dialog and moves focus to Dialog.Trigger.
//
///////////////////////////////////////////////////////////////////////////

//# Test nested modals

const RadixModal = ({
  overlayClassName = '',
  overlayStyle = {},

  dialogClassName = '',
  dialogStyle = {},

  children, // i.e., content
  contentClassName = '',
  contentStyle = {},

  headerClassName = '',
  headerStyle = {},

  title = '',
  titleClassName = '',
  titleStyle = {},

  description = '',
  descriptionClassName = '',
  descriptionStyle = {},

  bodyClassName = '',
  bodyStyle = {},

  footer = null,
  footerClassName = '',
  footerStyle = {},

  trigger = null,
  closeButton = true,

  defaultOpen,
  open = undefined,
  setOpen = undefined,

  fullscreen = false,
  centered = false, // ???
  // By default this should be true so that <select>s will be able to overflow.
  scrollable = false,
  disableAnimation: shouldDisableAnimation = false
}: IRadixModal) => {
  const firstRenderRef = useRef(true)
  const [disableAnimation, setDisableAnimation] = useState(
    shouldDisableAnimation
  )

  /* ======================
    getDialogClassName()
  ====================== */

  const getDialogClassName = () => {
    let classes = 'radix-modal-dialog'
    if (centered) {
      classes = `${classes} radix-modal-dialog-centered`
    }
    if (scrollable) {
      classes = `${classes} radix-modal-dialog-scrollable`
    }

    if (fullscreen) {
      classes = `${classes} radix-modal-fullscreen`
    }

    if (dialogClassName) {
      classes = `${classes} ${dialogClassName}`
    }
    return classes
  }

  /* ======================
    useLayoutEffect()
  ====================== */
  // If either open || defaultOpen is true on first render, then
  // temporarily disable the animation, so that it doesn't run
  // the first time. useLayoutEffect implemented because we want
  // this to take effect after render, but before paint.

  useLayoutEffect(() => {
    if (firstRenderRef.current === false || shouldDisableAnimation) {
      return
    }
    firstRenderRef.current = false

    if (open === true || defaultOpen === true) {
      setDisableAnimation(true)
      setTimeout(() => {
        setDisableAnimation(false)
      }, 300) // Milliseconds should match CSS animation-duration value.
    }
  }, [defaultOpen, open, shouldDisableAnimation])

  /* ======================
      renderCloseButton()
  ====================== */

  const renderCloseButton = () => {
    if (!closeButton) {
      return null
    }

    if (closeButton === true) {
      return (
        <Dialog.Close asChild>
          <button className='radix-modal-close-button' aria-label='Close'>
            {closeIcon}
          </button>
        </Dialog.Close>
      )
    }

    // This assumes that closeButton is a JSX element or
    // component that can be forwarded a ref.
    return <Dialog.Close asChild>{closeButton}</Dialog.Close>
  }

  /* ======================
        renderHeader()
  ====================== */

  const renderHeader = () => {
    if (!title && !description) {
      return null
    }

    return (
      <div
        className={`radix-modal-header${
          headerClassName ? ` ${headerClassName}` : ''
        }`}
        style={headerStyle}
      >
        {/* Title will be <h2> by default, so definitely set fontSize. Why use this?
          Because Radix will generate an aria-labelledby attribute on the top-level dialog.
          Similarly with the Description component, it will internally tell Radix to create
          an aria-describedby attribute ont the top-level dialog. This is all pointed out 
          in this Sam Selikoff tutorial at 10:00 : https://www.youtube.com/watch?v=KvZoBV_1yYE */}
        {title && (
          <Dialog.Title
            className={`radix-modal-title${
              titleClassName ? ` ${titleClassName}` : ''
            }`}
            style={titleStyle}
          >
            {title}
          </Dialog.Title>
        )}

        {description && (
          <Dialog.Description
            className={`radix-modal-description${
              descriptionClassName ? ` ${descriptionClassName}` : ''
            }`}
            style={descriptionStyle}
          >
            {description}
          </Dialog.Description>
        )}
      </div>
    )
  }

  /* ======================
        renderFooter()
  ====================== */
  // The footer renders conditionally based on a footer prop that
  // the consumer can pass content into. In contrast, the header is rendered
  // based on the presence of the title and/or description props being truthy.
  // This difference is a consequence of the specific logic that Radix applies
  // to Dialog.Title and Dialog.Description. The same treatent does not exist for
  // footer content, which is why we are using a different approach.

  const renderFooter = () => {
    if (!footer) {
      return null
    }

    return (
      <div
        className={`radix-modal-footer${
          footerClassName ? ` ${footerClassName}` : ''
        }`}
        style={footerStyle}
      >
        {footer}
      </div>
    )
  }

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    return (
      <Dialog.Content
        className={`radix-modal-content${
          contentClassName ? ` ${contentClassName}` : ''
        }`}
        style={{
          ...contentStyle,
          ...(disableAnimation ? { animationDuration: '0s' } : {})
        }}
      >
        {renderHeader()}

        {/* In general, any content that manages some state should be abstracted into its own component.
        For example a UserDialog instance that has a form and form state should abstract that logic into
        its own <Form /> component. That way when the modal closes, the content's state will be reset when unmounted.
        This point is emphasized in the following Sam Selikoff tutorial at 12:30 :
        https://www.youtube.com/watch?v=3ijyZllWBwU 
    
        Conversely, if you want the state to persist (e.g., a modal that shows API data that rarely changes).
        Then implement the state directly within the component instance. */}

        <div
          className={`radix-modal-body${
            bodyClassName ? ` ${bodyClassName}` : ''
          }`}
          style={bodyStyle}
        >
          {children}
        </div>

        {renderFooter()}

        {/* By placing this last it ensures that it will sit on top of the header. */}
        {renderCloseButton()}
      </Dialog.Content>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Dialog.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={(newOpen) => {
        setOpen?.(newOpen)
      }}
    >
      {/* One almost always wants to use the trigger prop over an external/programmatic trigger.
      Why? Because when the button is implemented with Radix's Dialog.Trigger, then by default focus will
      go back to the trigger element when the dialog is closed. This is not true if one was using some
      random programmatic button. */}
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay
          className={`radix-modal-overlay${
            overlayClassName ? ` ${overlayClassName}` : ''
          }`}
          style={{
            ...overlayStyle,
            ...(disableAnimation ? { animationDuration: '0s' } : {})
          }}
        >
          {/* In Radix, the convention is to name the entire component 'Dialog'. However, in Bootstrap 
          the 'dialog' (i.e., <div className='modal-dialog'>) refers to the part of the modal that 
          contains/wraps the <div className='modal-content'>. This extra wrapper is useful
          for features like centering and scrolling. */}
          <div className={getDialogClassName()} style={dialogStyle}>
            {renderContent()}
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const CompoundComponent = Object.assign(RadixModal, {
  // This is exposed because it may be used from within the content
  // For example, see the <Form /> component in the demo example.
  Close: Dialog.Close
})

export { CompoundComponent as RadixModal }
