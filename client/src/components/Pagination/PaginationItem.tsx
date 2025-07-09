// Third-party imports
import { forwardRef, useState, useEffect } from 'react'

// Custom imports
import { IPaginationItem, ButtonRefType } from './types'

/* ========================================================================
                        PaginationItem
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// first, previous, next and last props should also set the aria labeling.
// See how reactstrap does it...
//
// This component also needs to be able to accept a ref. Here's a quick refresher on how that works:
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/
//
// import  { forwardRef, useRef } from 'react'
//
// export type ButtonType = {} & React.ComponentProps<'button'>
// export type RefType = HTMLButtonElement
//
// export const Button = forwardRef<RefType, ButtonType>(
//   ({ children, className = '', style = {}, ...otherButtonProps }, ref) => (
//     <button ref={ref} className={className} style={style} {...otherButtonProps}>
//       {children}
//     </button>
//   )
// )
//
// ...
//
// const buttonRef = useRef<HTMLButtonElement | null>(null)
//
//   useEffect(() => {
//     if (buttonRef.current !== null) { console.log('buttonRef.current:', buttonRef.current) }
//   }, [])
//
//  ...
//
// <Button className='btn btn-primary btn-sm fw-bold' onClick={() => { alert('Click!') }} ref={buttonRef}>
//   Click Me
// </Button>
//
///////////////////////////////////////////////////////////////////////////

export const PaginationItem = forwardRef<ButtonRefType, IPaginationItem>(
  (
    {
      active = false,
      onHoverButtonStyle = {},
      onFocusButtonStyle = {},
      children,
      disabled = false,

      first = false,
      last = false,
      next = false,
      previous = false,

      paginationButtonClassName = '',
      paginationButtonStyle = {},
      paginationItemClassName = '',
      paginationItemStyle = {},

      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,

      ...otherButtonProps
    },
    ref
  ) => {
    const [isHovering, setIsHovering] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    ///////////////////////////////////////////////////////////////////////////
    //
    // When style props are passed in for the button, they will necessarily overwrite
    // any class related styles such as .page-link.disabled, .disabled > .page-link { ... }
    //  This can be fixed in one of two ways. Add !important to the associated
    // .disabled / :disabled CSS, or create a disabledStyles object within this component
    // that gets added when disabled prop is true.
    //
    // Currently, PaginationItems are only disabled in first/last previous/next
    // when at the beginning or end of the pagination. However, because of this
    // issue the items don't look disabled.
    //
    ///////////////////////////////////////////////////////////////////////////

    const paginationButtonDisabledStyle: React.CSSProperties = {
      color: '#6c757d',
      pointerEvents: 'none',
      backgroundColor: '#fff',
      // Gotcha: Because border is beind defined with the shorthand property, the
      // same must be done any time styles are passed in using a style object:
      // Console warning: Removing a style property during rerender (border) when a conflicting
      // property is set (borderColor) can lead to styling bugs. To avoid this, don't mix
      // shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.
      border: '1px solid #6c757d' // '#dee2e6'
    }

    paginationButtonStyle = (function getPaginationButtonStyle() {
      if (disabled) {
        return { ...paginationButtonStyle, ...paginationButtonDisabledStyle }
      }

      if (isHovering && isFocused) {
        return {
          ...paginationButtonStyle,
          ...onFocusButtonStyle,
          ...onHoverButtonStyle
        }
      }

      if (isHovering && !isFocused) {
        return { ...paginationButtonStyle, ...onHoverButtonStyle }
      }

      if (!isHovering && isFocused) {
        return {
          ...paginationButtonStyle,
          ...onFocusButtonStyle
        }
      }

      return paginationButtonStyle
    })()

    //# Nice-to-haves:
    //# onHoverButtonClassName
    //# onHoverItemStyle
    //# onHoverItemClassName
    //#
    //# onFocusButtonClassName
    //# onFocusItemStyle
    //# onFocusItemClassName

    /* ======================
    getPaginationItemClasses()
    ====================== */

    const getPaginationItemClasses = () => {
      let classes = 'page-item'

      if (active) {
        classes = `${classes} active`
      }

      if (disabled) {
        classes = `${classes} disabled`
      }

      if (paginationItemClassName) {
        classes = `${classes} ${paginationItemClassName}`
      }
      return classes
    }

    /* ======================
      getLinkClasses()
    ====================== */
    // Link is somewhat of a misnomer since we're not using <a> tags.
    // Instead, we're using <button> tags. Reactstrap also uses buttons,
    // but maintains the 'link' nomenclature.

    const getLinkClasses = () => {
      let classes = 'page-link'

      // In the Bootstrap implmentation, the button never gets the active class.
      // if (active) { classes = `${classes} ms-pagination-item-active` }

      // In the Bootstrap implmentation, the button never gets the disabled class.
      // if (disabled) { classes = `${classes} disabled` }

      if (paginationButtonClassName) {
        classes = `${classes} ${paginationButtonClassName}`
      }
      return classes
    }

    /* ======================
        renderContent()
    ====================== */

    const renderContent = () => {
      let content = children
      if (first) {
        content = children ? `« ${children}` : '«'
      } else if (last) {
        content = children ? `${children} »` : '»'
      } else if (previous) {
        content = children ? `‹ ${children}` : '‹'
      } else if (next) {
        content = children ? `${children} ›` : '›'
      }
      return content
    }

    /* ======================
            useEffect()
    ====================== */

    useEffect(() => {
      if (disabled) {
        setIsHovering(false)
        setIsFocused(false)
      }
    }, [disabled])

    /* ======================
            return
    ====================== */

    return (
      <li className={getPaginationItemClasses()} style={paginationItemStyle}>
        <button
          // Note: otherProps is spread first to avoid unintentionally overwriting other props.
          {...otherButtonProps} // e.g., onMouseDown, etc.
          className={getLinkClasses()}
          disabled={disabled}
          // This is a cool trick, but it's easier to mod style prop outside of JSX.
          // {...{
          //   style: activeBackground
          //     ? { ...paginationButtonStyle, backgroundColor: activeBackground }
          //     : paginationButtonStyle
          // }}
          style={paginationButtonStyle}
          ref={ref}
          onClick={(e) => {
            onClick?.(e)
          }}
          onMouseEnter={(e) => {
            onMouseEnter?.(e)

            setIsHovering(true)
          }}
          onMouseLeave={(e) => {
            onMouseLeave?.(e)
            setIsHovering(false)
          }}
          onFocus={(e) => {
            onFocus?.(e)
            setIsFocused(true)
          }}
          onBlur={(e) => {
            onBlur?.(e)
            setIsFocused(false)
          }}
        >
          {renderContent()}
        </button>
      </li>
    )
  }
)
