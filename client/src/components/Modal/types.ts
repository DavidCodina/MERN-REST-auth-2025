export interface IModal {
  addCloseButton?: boolean
  centered?: boolean
  children?: React.ReactNode
  fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  id?: string
  show: boolean
  modalBackdrop?: boolean
  modalClassName?: string
  /** Useful for setting zIndex. By default it is 1055. */
  modalStyle?: React.CSSProperties

  /** Useful for changing overall background color, border-radius etc.
   * Do not confuse this with modalBodyClassName
   * Do not change background color on modal body.
   * */
  modalContentClassName?: string

  /** Useful for changing overall background color, border-radius, etc.
   * Do not change background color on modal body.
   * Do not confuse this with modalBodyStyle
   */
  modalContentStyle?: React.CSSProperties

  modalDialogClassName?: string
  /** Useful for changing width of Modal dialog, etc. */
  modalDialogStyle?: React.CSSProperties
  portalId?: string
  /** When provided, a modalRoot will be dynamically injected into the DOM with the
   * associated id string. modalRoot will then be used as a portal. If portalId also
   * was provided, then portalId will be used a a portal insteal and modalRoot will
   * not be created.
   */
  createPortalWithIdOf?: string

  scrollable?: boolean
  shouldAnimate?: boolean
  shouldShowBackdrop?: boolean
  size?: 'sm' | 'lg' | 'xl'
  onClose: () => void
}

export interface IModalHeader {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  titleClassName?: string
  titleStyle?: React.CSSProperties
  onClose?: () => void
}

export interface IModalBody {
  children?: React.ReactNode
  /** Useful for setting body padding, etc. Do not set background color here. */
  className?: string
  /** Useful for setting body padding, etc. Do not set background color here. */
  style?: React.CSSProperties
}

export interface IModalFooter {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
