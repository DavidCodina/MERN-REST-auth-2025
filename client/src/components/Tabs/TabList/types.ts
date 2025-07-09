import { ComponentProps } from 'react'

export interface ITabList extends ComponentProps/*WithRef*/ <'nav'> {
  /** A boolean value that when true centers the nav items (not applicable when vertical). */
  center?: boolean
  /** A boolean value that when true stretches nav items to fill entire width (not applicable when vertical). */
  navFill?: boolean
  /** A boolean value that when true stretches nav items to equally fill entire width (not applicable when vertical). */
  navJustified?: boolean
  /** A boolean value that when true positions the nav items on the right side (not applicable when vertical). */
  right?: boolean
  // children, className, children, etc. are implied by ComponentProps<'nav'>
}

export type TabListRef = HTMLElement
