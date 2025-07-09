import { ReactNode, CSSProperties, JSX } from 'react'

export interface IRadixPopOver {
  trigger?: JSX.Element

  children?: ReactNode
  contentClassName?: string
  contentStyle?: CSSProperties

  arrow?: boolean
  arrowClassName?: string
  arrowStyle?: CSSProperties

  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  closeButton?: boolean
}
