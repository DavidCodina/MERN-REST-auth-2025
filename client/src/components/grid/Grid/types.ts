import { ReactNode, CSSProperties } from 'react'

export interface IGrid {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Shorthand for row-gap and column-gap. Use a single value, or two values separated by a space (lattter must be a string) */
  gap?: number | string
  /** Can be used to set the number of columns. Note that media queries are mobile first, so
   *  xs - xxl will overwrite gridTemplateColumns. Put another way, one could just set xs
   * instead of gridTemplateColumns.
   */
  gridTemplateColumns?: string | number
  /** Alias for gridTemplateColumns */
  cols?: string | number
  gridTemplateRows?: string | number
  /** Alias for gridTemplateRows */
  rows?: string | number
  gridAutoFlow?: string
  /** Sets the height for each grid item (instead of setting the grid items themselves.) */
  gridAutoRows?: string
  gridAutoColumns?: string
  /** Generally used to set the number of grid-template-columns for xs screen width.
   * When a string is passed it should be a valid grid-template-columns value.
   * When a number is passed it will convert to `repeat(${xs}, minmax(0, 1fr))`.
   * For fine-grained control one can also pass React.CSSProperties. */
  xs?: string | number | CSSProperties
  /** Generally used to set the number of grid-template-columns for sm screen width.
   * When a string is passed it should be a valid grid-template-columns value.
   * When a number is passed it will convert to `repeat(${sm}, minmax(0, 1fr))`.
   * For fine-grained control one can also pass React.CSSProperties.*/
  sm?: string | number | CSSProperties
  /** Generally used to set the number of grid-template-columns for md screen width.
   * When a string is passed it should be a valid grid-template-columns value.
   * When a number is passed it will convert to `repeat(${md}, minmax(0, 1fr))`.
   * For fine-grained control one can also pass React.CSSProperties. */
  md?: string | number | CSSProperties
  /** Generally used to set the number of grid-template-columns for lg screen width.
   * When a string is passed it should be a valid grid-template-columns value.
   * When a number is passed it will convert to `repeat(${lg}, minmax(0, 1fr))`.
   * For fine-grained control one can also pass React.CSSProperties. */
  lg?: string | number | CSSProperties
  /** Generally used to set the number of grid-template-columns for xl screen width.
   * When a string is passed it should be a valid grid-template-columns value.
   * When a number is passed it will convert to `repeat(${xl}, minmax(0, 1fr))`.
   * For fine-grained control one can also pass React.CSSProperties. */
  xl?: string | number | CSSProperties
  /** Generally used to set the number of grid-template-columns for xxl screen width.
   * When a string is passed it should be a valid grid-template-columns value.
   * When a number is passed it will convert to `repeat(${xxl}, minmax(0, 1fr))`.
   * For fine-grained control one can also pass React.CSSProperties. */
  xxl?: string | number | CSSProperties
}
