import { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'

/** <p>This comment is directly above <code>ButtonProps</code>. It will be shown
 * in the associated  <code>ButtonProps</code> {@link https://typedoc.org | TypeDoc} page.</p>
 */
export type ButtonProps = {
  leftSection?: ReactNode
  rightSection?: ReactNode
  /**  Determines whether the button shows as loading. */
  loading?: boolean
  loadingStyle?: CSSProperties
  loadingClassName?: string
  loader?: ReactNode
  /** In NextUI isIconOnly controls whether the button should have the same width and height.
   * Here, that practice is extended to also control how the loader is rendered.
   */
  isIconOnly?: boolean
} & ComponentPropsWithRef<'button'>

export type ButtonRef = HTMLButtonElement
