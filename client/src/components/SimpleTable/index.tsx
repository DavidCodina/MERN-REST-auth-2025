import 'overlayscrollbars/overlayscrollbars.css' // Move to main.tsx for production.

// Way better than webkit scrollbars!
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { ISimpleTable } from './types'

/* =============================================================================
                                  SimpleTable
============================================================================= */
//# Add a forwardRef.

////////////////////////////////////////////////////////////////////////////////
//
// Setting a min column width.
//
// One nice-to-have would be a minColWidth prop. This way we can
// ensure that <table> never squishes one column too much.
// You might thing to use a maxColWidth prop instead. However,
// setting maxWidth on a <th> just gets ignored. In any case,
// rather than actually implementing minColWidth, what we can
// actually do is JUST set minWidths on the <th> elements within
// the <thead>. If there's no <thead>, then just set the minWidth on
// the <td> elements of the first <td> within <tbody>.
//
////////////////////////////////////////////////////////////////////////////////

export const SimpleTable = ({
  bordered = false,
  borderless = false,
  captionTop = false,
  children,
  className = '',
  flush = false,
  headerFooterAccent = false,
  hover = false,
  hoverData = false,
  // NextUI wraps <table> in a <div> by default and exposes a removeWrapper prop
  // if the consumer does not want the container.  I prefer to explicitly require
  // the consumer to implement the container. This ensures that they are always aware
  // that there is a container by virtue of having to specify the useContainer prop.
  useContainer = false,
  containerClassName = '',
  containerStyle = {},
  rounded = false,
  size,
  striped = false,
  stripedData = false,
  stripedColumns = false,
  style = {},
  ...otherProps // i.e.,  other <table> props.
}: ISimpleTable) => {
  rounded = typeof rounded === 'number' ? rounded : rounded === true ? 5 : 0

  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    let classes = 'table'

    if (className) {
      classes = `${classes} ${className}`
    }

    if (bordered) {
      classes = `${classes} table-bordered`
    } else if (borderless) {
      classes = `${classes} table-borderless`
    }

    if (captionTop) {
      classes = `${classes} caption-top`
    }

    // rounded only works in conjunction with useContainer
    // because it needs the div container to wrap the table
    if (flush || (rounded && useContainer)) {
      classes = `${classes} table-flush`
    }

    if (headerFooterAccent) {
      classes = `${classes} header-footer-accent`
    }

    if (hoverData) {
      classes = `${classes} table-hover-data`
    } else if (hover) {
      classes = `${classes} table-hover`
    }

    if (size === 'xs') {
      classes = `${classes} table-xs`
    } else if (size === 'sm') {
      classes = `${classes} table-sm`
    }

    if (stripedData) {
      classes = `${classes} table-striped-data`
    } else if (striped) {
      classes = `${classes} table-striped`
    } else if (stripedColumns) {
      classes = `${classes} table-striped-columns`
    }

    return classes
  }

  /* ======================
          table
  ====================== */

  const table = (
    <table className={getClassName()} style={style} {...otherProps}>
      {children}
    </table>
  )

  /* ======================
          return
  ====================== */
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Ordinarily, I'd suggest making the responsive container a standalone component
  // that then gets attached to SimpleTable. The problem is that when rounded is truthy,
  // we apply it to the container, while also applying '.table-flush' to the <table>.
  // Yes, we could build out a Context and do it that way, but it's just easier to
  // bake the container <div> directly into SimpleTable.
  //
  // The trade-off with the container element is that it makes using a <caption>
  // kind of quirky if the goal is to position it in a way that makes it look external
  // to the <table>. Even if you absolute position the <caption>, it will still
  // take up vertical scroll space. The alternative is to simply style the <caption>
  // as if it were a header or footer within the container.
  //
  //   <caption className='relative bg-stone-100 px-2 py-2 text-sm font-black uppercase text-[#333] before:absolute before:bottom-2 before:left-2/4 before:h-[1.5px] before:w-20 before:-translate-x-2/4 before:bg-[#333] before:transition-all before:content-[""] before:group-hover:w-11/12'>User Data</caption>
  //
  ////////////////////////////////////////////////////////////////////////////////

  if (useContainer) {
    // return (
    //   <section
    //     className={`table-container${
    //       containerClassName ? ` ${containerClassName}` : ''
    //     }`}
    //     style={{
    //       ...(rounded ? { borderRadius: rounded } : {}),
    //       ...containerStyle
    //     }}
    //   >
    //     {table}
    //   </section>
    // )

    return (
      <OverlayScrollbarsComponent
        defer
        // element='div'
        // https://kingsora.github.io/OverlayScrollbars/
        options={{
          scrollbars: {
            // autoHide: 'scroll',
            // autoHideDelay: 0
            // theme: 'os-theme-custom'
          }
        }}
        className={`overlay-scrollbars-table-container${
          containerClassName ? ` ${containerClassName}` : ''
        }`}
        style={{
          ...(rounded ? { borderRadius: rounded } : {}),
          // If rounded & useContainer, then '.table-flush' styles are also applied.
          // Part of what '.table-flush' does is strip the outside border.
          // Thus, in in an effort to restore the style, a borderWidth:1 applied
          // to the container. The trade-off is that if the consumer tries to
          // set a thicker borderWidth they will run into issued.
          ...(rounded && useContainer && bordered ? { borderWidth: 1 } : {}),
          ...containerStyle
        }}
      >
        {table}
      </OverlayScrollbarsComponent>
    )
  }

  return table
}
