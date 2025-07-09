// Custom imports
import { useMediaQuery } from '../useMediaQuery'
import { breakpoints } from '../breakpoints'
import { IGridItem } from './types'

/* ========================================================================
                                GridItem
======================================================================== */

export function GridItem({
  children,
  className = '',
  colSpan,
  gridColumn = 'auto / auto',
  gridRow = 'auto / auto',
  lg,
  md,
  rowSpan,
  sm,
  style = {},
  xl,
  xs,
  xxl
}: IGridItem) {
  const xsBreakpoint = useMediaQuery(`(min-width: ${breakpoints.xs})`)
  const smBreakpoint = useMediaQuery(`(min-width: ${breakpoints.sm})`)
  const mdBreakpoint = useMediaQuery(`(min-width: ${breakpoints.md})`)
  const lgBreakpoint = useMediaQuery(`(min-width: ${breakpoints.lg})`)
  const xlBreakpoint = useMediaQuery(`(min-width: ${breakpoints.xl})`)
  const xxlBreakpoint = useMediaQuery(`(min-width: ${breakpoints.xxl})`)

  /* ======================
      Alias Conversions
  ====================== */
  // For simplified readability and usage a consumer
  // is allowed to use colSpan and rowSpan instead of
  // gridColumn and gridRow. It's semantically more
  // intuitive (i.e., similar to table attributes) to
  // simply pass a single number. Note that colSpan
  // overwrites gridColumn and rowSpan overwrites gridRow.

  if (colSpan) {
    gridColumn = colSpan
  }

  if (rowSpan) {
    gridRow = rowSpan
  }

  /* ======================
  gridColumn value & gridRow value shorthand conversions.
  ====================== */

  if (typeof gridColumn === 'number') {
    gridColumn = `span ${gridColumn}`
  }

  if (typeof gridRow === 'number') {
    gridRow = `span ${gridRow}`
  }

  /* ======================
  xs - xxl Shorthand Conversions
  ====================== */

  if (typeof xs === 'number') {
    xs = `span ${xs}`
  }

  if (typeof sm === 'number') {
    sm = `span ${sm}`
  }

  if (typeof md === 'number') {
    md = `span ${md}`
  }

  if (typeof lg === 'number') {
    lg = `span ${lg}`
  }

  if (typeof xl === 'number') {
    xl = `span ${xl}`
  }

  if (typeof xxl === 'number') {
    xxl = `span ${xxl}`
  }

  /* ======================
  Convert xs - xxl grid-column value to complete rule
  ====================== */
  // Determine if xs - xxl is a string.
  // If it is a string, then it should represent
  // a valid grid-column value (albeit as a React CSSProperty value).
  // Convert that value to a complete rule.

  if (typeof xs === 'string') {
    xs = { gridColumn: xs }
  }

  if (typeof sm === 'string') {
    sm = { gridColumn: sm }
  }

  if (typeof md === 'string') {
    md = { gridColumn: md }
  }

  if (typeof lg === 'string') {
    lg = { gridColumn: lg }
  }

  if (typeof xl === 'string') {
    xl = { gridColumn: xl }
  }

  if (typeof xxl === 'string') {
    xxl = { gridColumn: xxl }
  }

  /* ======================
          Styles
  ====================== */

  const baseStyle = {
    gridColumn,
    gridRow
  }

  const responsiveStyle = {
    ...(xsBreakpoint ? xs : {}),
    ...(smBreakpoint ? sm : {}),
    ...(mdBreakpoint ? md : {}),
    ...(lgBreakpoint ? lg : {}),
    ...(xlBreakpoint ? xl : {}),
    ...(xxlBreakpoint ? xxl : {})
  }

  /* ======================
          return
  ====================== */

  return (
    <div
      className={className}
      //# Consider if maybe baseStyle should go AFTER responsiveStyle ???
      style={{
        ...baseStyle,
        ...responsiveStyle,
        ...style
      }}
    >
      {children}
    </div>
  )
}
