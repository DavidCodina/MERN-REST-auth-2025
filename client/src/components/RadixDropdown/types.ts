import { ReactNode, CSSProperties, JSX } from 'react'

export interface IRadixDropdown {
  trigger?: JSX.Element
  children?: ReactNode
  contentClassName?: string
  contentStyle?: CSSProperties
  arrow?: boolean
  arrowClassName?: string
  arrowStyle?: CSSProperties
  defaultOpen?: boolean
  modal?: boolean
  /** The preferred side the popup should render on (if possible). */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** The amount of offset beween popup and trigger element. */
  sideOffset?: number
}
