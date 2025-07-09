// Third-party imports
import { ReactNode, CSSProperties, JSX } from 'react'

export interface IToolTip {
  trigger?: JSX.Element

  children?: ReactNode
  contentClassName?: string
  contentStyle?: CSSProperties

  arrow?: boolean
  arrowClassName?: string
  arrowStyle?: CSSProperties

  defaultOpen?: boolean
  /** The preferred side the popup should render on (if possible). */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** The amount of offset beween popup and trigger element. */
  sideOffset?: number

  closeOnClick?: boolean
  toggleForceMount?: boolean

  /** The duration from when the pointer enters the trigger until the tooltip gets opened. */
  delayDuration?: number
  skipDelayDuration?: number

  // Intentionally omitting align. It's too much complexity for the current use case.
  // If side is 'top' or 'bottom', then 'end' will push content to the left such
  // that the right edge of Content and Trigger are aligned. If side is 'left' or
  // 'right', then 'end' means the bottom of the Trigger. With the current arrow style
  // anything but 'center' would make the arrow look a little wonky.
  // align?: 'start' | 'center' | 'end'

  // Intentionally omitting alignOffset.
  // alignOffset allows for more fine-grained control of how the Content is alinged against Trigger
  // For example, with the current arrow styles we would need at least alignOffset={-1} if align
  // were 'start' or 'end'. But actually, a better solution is to use something like arrowPadding={12}
  // alignOffset?: number

  // Intentionally omitting arrowPadding.

  // Intentionally omitting disableHoverableContent.
  // Will hide tooltip if you hover over it. By default it's false, which allows for
  // actions, etc. to be inside of the tooltip. The docs specifically say that,
  // "Disabling this has accessibility consequences." There's really no good reason to
  // do this.
}
