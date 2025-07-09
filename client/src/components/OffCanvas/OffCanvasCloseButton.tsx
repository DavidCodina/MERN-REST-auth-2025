import { ComponentProps } from 'react'

export interface IOffCanvasCloseButton extends ComponentProps<'button'> {
  onClose?: () => void
}

/* ========================================================================
                              OffCanvasButton
======================================================================== */

export const OffCanvasCloseButton = ({
  onClose,
  style = {},
  className = '',
  ...otherProps
}: IOffCanvasCloseButton) => {
  return (
    <button
      className={`offcanvas-close-button${className ? ` ${className}` : ''}`}
      onClick={() => {
        if (typeof onClose === 'function') {
          onClose()
        }
      }}
      style={style}
      {...otherProps}
    />
  )
}
