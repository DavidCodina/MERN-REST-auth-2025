import { ReactNode, CSSProperties, JSX } from 'react'

export interface IRadixModal {
  overlayClassName?: string
  overlayStyle?: CSSProperties

  /** This is where you'd set width/maxWidth - NOT on contentClassName/contentStyle. */
  dialogClassName?: string
  /** This is where you'd set width/maxWidth - NOT on contentClassName/contentStyle. */
  dialogStyle?: CSSProperties
  // i.e., content - This is optional. Why?
  // In some cases we might want to extend IRadixModal and the children would
  // already be baked into that instance. In such cases we wouldn't want to
  // require that there be children, since it's already being handled internally.
  // interface ISpecificModal extends ComponentProps<typeof RadixModal> {}
  children?: ReactNode
  contentClassName?: string
  contentStyle?: CSSProperties

  headerClassName?: string
  headerStyle?: CSSProperties

  title?: ReactNode
  titleClassName?: string
  titleStyle?: CSSProperties

  description?: ReactNode
  descriptionClassName?: string
  descriptionStyle?: CSSProperties

  bodyClassName?: string
  bodyStyle?: CSSProperties

  footer?: ReactNode
  footerClassName?: string
  footerStyle?: CSSProperties

  trigger?: ReactNode
  closeButton?: boolean | JSX.Element

  centered?: boolean
  scrollable?: boolean
  fullscreen?: boolean

  disableAnimation?: boolean
  defaultOpen?: boolean
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}
