import { CSSProperties, ReactNode } from 'react'

// gridColumnStart and gridColumnEnd have been omitted in favor of the gridColumn shorthand.
// gridRowStart and gridRowEnd have been omitted in favor of the gridRow shorthand.
export interface IGridItem {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Set the column start & end positions. While column width can be controlled just from the grid container,
   * using gridColumn allows for more fine-grained control (kind of like align-items is to align-self in flexbox.)
   */
  gridColumn?: string | number
  /** Alias/shorthand for gridColumn - e.g., will convert 2 to 'span 2' */
  colSpan?: number
  /** Set the row start & end positions. Depends on gridAutoRows or gridTemplateRows
   * being set on the grid container.
   */
  gridRow?: string | number
  /** Alias/shorthand for gridRow - e.g., will convert 2 to 'span 2' */
  rowSpan?: number
  /** Generally used to set the number of columns an item spans for xs screen width.
   * When a string is passed it should be a valid grid-column value.
   * When a number is passed it will convert to `span ${xs}`.
   * For fine-grained control one can also pass React.CSSProperties. */
  xs?: string | number | CSSProperties
  /** Generally used to set the number of columns an item spans for sm screen width.
   * When a string is passed it should be a valid grid-column value.
   * When a number is passed it will convert to `span ${sm}`.
   * For fine-grained control one can also pass React.CSSProperties. */
  sm?: string | number | CSSProperties
  /** Generally used to set the number of columns an item spans for md screen width.
   * When a string is passed it should be a valid grid-column value.
   * When a number is passed it will convert to `span ${md}`.
   * For fine-grained control one can also pass React.CSSProperties. */
  md?: string | number | CSSProperties
  /** Generally used to set the number of columns an item spans for lg screen width.
   * When a string is passed it should be a valid grid-column value.
   * When a number is passed it will convert to `span ${lg}`.
   * For fine-grained control one can also pass React.CSSProperties. */
  lg?: string | number | CSSProperties
  /** Generally used to set the number of columns an item spans for xl screen width.
   * When a string is passed it should be a valid grid-column value.
   * When a number is passed it will convert to `span ${xl}`.
   * For fine-grained control one can also pass React.CSSProperties. */
  xl?: string | number | CSSProperties
  /** Generally used to set the number of columns an item spans for xxl screen width.
   * When a string is passed it should be a valid grid-column value.
   * When a number is passed it will convert to `span ${xxl}`.
   * For fine-grained control one can also pass React.CSSProperties. */
  xxl?: string | number | CSSProperties
}
