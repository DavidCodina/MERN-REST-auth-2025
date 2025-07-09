import { Fragment, useEffect, useRef } from 'react'
import { useBreadcrumbContext } from './BreadcrumbContext'

/* ========================================================================
                                BreadcrumbItem
======================================================================== */

export const BreadcrumbItem = ({
  active = false,
  children,
  onClick,
  href,
  className = '',
  style = {},
  linkClassName = '',
  linkStyle = {},
  underline = 'hover',
  ...otherProps
}: any) => {
  /* ======================
       state & refs
  ====================== */

  const internalRef = useRef<HTMLLIElement | null>(null)

  const { items, setItems, separator } = useBreadcrumbContext()

  const firstItem = items[0]

  const isFirstItem = (() => {
    if (!firstItem || !firstItem.current || !internalRef.current) {
      return false
    }
    if (firstItem.current === internalRef.current) {
      return true
    }
    return false
  })()

  /* ======================
      getItemClasses()
  ====================== */

  const getItemClasses = () => {
    let classes = 'breadcrumb-item'

    if (className && typeof className === 'string') {
      classes = `${classes} ${className}`
    }

    if (active) {
      classes = `${classes} breadcrumb-active`
    }

    return classes
  }

  /* ======================
      getLinkClasses()
  ====================== */

  const getLinkClasses = () => {
    let classes = 'breadcrumb-link'

    if (linkClassName && typeof linkClassName === 'string') {
      classes = `${classes} ${linkClassName}`
    }

    if (active === true || underline === 'none') {
      classes = `${classes} breadcrumb-link-no-underline`
    } else if (underline === 'always') {
      classes = `${classes} breadcrumb-link-underline`
    } else if (underline === 'hover') {
      classes = `${classes} breadcrumb-link-hover-underline`
    }

    return classes
  }

  /* ======================
       useEffect()
  ====================== */
  // Register each BreadcrumbItem by its ref.

  useEffect(() => {
    setItems((prevItems) => {
      return [...prevItems, internalRef]
    })
  }, [setItems])

  /* ======================
      renderLinkOrSpan()
  ====================== */

  const renderLinkOrSpan = () => {
    if (active) {
      return (
        <span className={getLinkClasses()} style={linkStyle} {...otherProps}>
          {children}
        </span>
      )
    }
    return (
      <a // eslint-disable-line
        className={getLinkClasses()}
        // Including href might be important for styling purposes...
        href={href && typeof href === 'string' ? href : ''}
        onClick={(e) => {
          // Note: In MUI they often wrap the entire Breadcrumbs implementation in a <div> that then
          // has it's own onClick with an e.preventDefault(). That would also work due to event bubbling,
          // but it might not be the best practice as it could lead to unexpected behavior in more complex applications.
          e.preventDefault()
          onClick?.(e)
        }}
        role='button'
        style={linkStyle}
        tabIndex='0'
        {...otherProps}
      >
        {children}
      </a>
    )
  }

  /* ======================
          return
  ====================== */
  // Todo: The active <li> gets: aria-current='page'

  return (
    <Fragment>
      {!isFirstItem && (
        <li aria-hidden='true' className='breadcrumb-separator'>
          {separator}
        </li>
      )}

      <li
        className={getItemClasses()}
        ref={internalRef}
        style={{
          ...style
        }}
      >
        {renderLinkOrSpan()}
      </li>
    </Fragment>
  )
}
