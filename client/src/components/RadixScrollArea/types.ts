import { CSSProperties, ReactNode } from 'react'

export interface IRadixScrollArea {
  children?: ReactNode
  /** Applied to ScrollArea.Root, the top-level container. */
  className?: string
  /** Applied to ScrollArea.Root, the top-level container.  */
  style?: CSSProperties
  /** If you set false on one or the other then Radix will very aggressively set that
   * axis to overflow:hidden. For this reason, it's generally best to always allow
   * both vertical and horizontal to be true (default).
   */
  horizontal?: boolean
  vertical?: boolean
  scrollHideDelay?: number
}
