// Custom imports
import { useMediaQuery } from '../useMediaQuery'
import { breakpoints } from '../breakpoints'
import { IGrid } from './types'

/* ========================================================================
                                Grid
======================================================================== */
// The Grid / GridItem system covers most use cases.
// It does not make use of grid-area syntax as that is more of a special use case.
//
// In most cases react-mainstem library does not expose the style prop to the
// consumer. In this case, it's highly recommended to expose it. Grid and
// GridItem are layout components thay may need height, width, minHeight, minWidth,
// maxHeight, maxWidth, margin, etc. The grid system is also often used in conjunction
// with justify-content, justify-items, justify-self, align-content, align-items,
// align-self, place-content, place-items, place-self, order, etc. However, creating distinct
// props for each of these properties would overcomplicate the interface.

export function Grid({
  children,
  className = '',
  cols,
  gap = 0,
  gridAutoColumns = 'auto',
  gridAutoFlow = 'row',
  gridAutoRows = 'auto',
  gridTemplateColumns = 'none',
  gridTemplateRows = 'none',
  lg,
  md,
  rows,
  sm,
  style = {},
  xl,
  xs,
  xxl
}: IGrid) {
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
  // is allowed to use cols and rows instead of
  // gridTemplateColumns and gridTemplateRows. It's
  // semantically more intuitive (i.e., similar to reactstrap) to
  // simply pass a single number. Note that cols overwrites
  // gridTemplateColumns and rows overwrites gridTemplateRows.

  if (cols) {
    gridTemplateColumns = cols
  }

  if (rows) {
    gridTemplateRows = rows
  }

  /* ======================
  gridTemplateColumns value & gridTemplateRows value shorthand conversions.
  ====================== */

  if (typeof gridTemplateColumns === 'number') {
    gridTemplateColumns = `repeat(${gridTemplateColumns}, minmax(0, 1fr))`
  }

  if (typeof gridTemplateRows === 'number') {
    gridTemplateRows = `repeat(${gridTemplateRows}, minmax(0, 1fr))`
  }

  /* ======================
  xs - xxl Shorthand Conversions
  ====================== */

  if (typeof xs === 'number') {
    xs = `repeat(${xs}, minmax(0, 1fr))`
  }

  if (typeof sm === 'number') {
    sm = `repeat(${sm}, minmax(0, 1fr))`
  }

  if (typeof md === 'number') {
    md = `repeat(${md}, minmax(0, 1fr))`
  }

  if (typeof lg === 'number') {
    lg = `repeat(${lg}, minmax(0, 1fr))`
  }

  if (typeof xl === 'number') {
    xl = `repeat(${xl}, minmax(0, 1fr))`
  }

  if (typeof xxl === 'number') {
    xxl = `repeat(${xxl}, minmax(0, 1fr))`
  }

  /* ======================
  Convert xs - xxl grid-template-columns value to complete rule
  ====================== */
  // Determine if xs - xxl is a string.
  // If it is a string, then it should represent
  // a valid grid-template-columns value (albeit as a React CSSProperty value).
  // Convert that value to a complete rule.

  if (typeof xs === 'string') {
    xs = { gridTemplateColumns: xs }
  }

  if (typeof sm === 'string') {
    sm = { gridTemplateColumns: sm }
  }

  if (typeof md === 'string') {
    md = { gridTemplateColumns: md }
  }

  if (typeof lg === 'string') {
    lg = { gridTemplateColumns: lg }
  }

  if (typeof xl === 'string') {
    xl = { gridTemplateColumns: xl }
  }

  if (typeof xxl === 'string') {
    xxl = { gridTemplateColumns: xxl }
  }

  /* ======================
          Styles
  ====================== */

  const baseStyle = {
    display: 'grid',
    gap,
    gridAutoColumns,
    gridAutoFlow,
    gridAutoRows,
    gridTemplateColumns,
    gridTemplateRows
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
