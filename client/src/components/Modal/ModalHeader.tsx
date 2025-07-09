// Custom imports
import { ModalCloseButton } from './ModalCloseButton'
import { twMerge } from 'tailwind-merge'
import { stopEvents } from './utils'
import { IModalHeader } from './types'

/* ========================================================================
                                  ModalHeader
========================================================================= */

export function ModalHeader({
  children,
  className = '',
  style = {},
  titleClassName = '',
  titleStyle = {},
  onClose
}: IModalHeader) {
  /* ======================
      getClassName()
  ====================== */

  const getClassName = () => {
    const base =
      'xx-modal-header transition-colors duration-300 ease-linear dark:border-b dark:border-(--dark-primary-color)'
    const background = `bg-white dark:bg-(--dark-body-color)`
    const shadow = `shadow-[0_1px_2px__rgba(0,0,0,0.35)]`
    const _className = twMerge(`${base} ${background} ${shadow}`, className)
    return _className
  }

  /* ======================
    renderTitleOrChildren()
  ====================== */

  const renderTitleOrChildren = () => {
    if (typeof children === 'string') {
      return (
        <h5
          className={titleClassName}
          style={{
            fontWeight: 700,
            lineHeight: 1,
            margin: 0,
            ...titleStyle
          }}
        >
          {children}
        </h5>
      )
    }
    return children
  }

  /* ======================
      handleModalClose()
  ====================== */
  // This is for closing the modal when a user clicks on the close X.
  // We are able to get away with using toggle() based on the
  // assumption that the modal will be open at this point.

  const handleModalClose = () => {
    if (typeof onClose === 'function') {
      stopEvents('click', 500)
      onClose?.()
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <div style={style} className={getClassName()}>
      {renderTitleOrChildren()}
      {onClose && typeof onClose === 'function' && (
        <ModalCloseButton onClick={handleModalClose} />
      )}
    </div>
  )
}
