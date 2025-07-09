import { CSSProperties, ReactNode } from 'react'

interface IBreadcrumb {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
/* ========================================================================

======================================================================== */

export const Breadcrumb = ({
  children,
  className = '',
  style = {}
}: IBreadcrumb) => {
  /* ======================
          return
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: MUI does something interesting. They seem
  // to take each child in children and wrap it in an <li>.
  // This allows them to use the <Link/> component, while also
  // automatically wrapping it in an <li>. While that could
  // be useful, I prefer to use BreadcrumbItem because that allows
  // more control over each item.
  //
  // return (
  //   <nav>
  //     <ol className='breadcrumb'>
  //       {Children.map(children, (child, index) => ( <li key={index}>{child}</li>))}
  //     </ol>
  //   </nav>
  // )
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <nav className={className} style={style} aria-label='breadcrumb'>
      <ol className='breadcrumb'>{children}</ol>
    </nav>
  )
}
