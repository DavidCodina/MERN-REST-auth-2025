// Third-party imports
import { forwardRef } from 'react'

// https://github.com/epicweb-dev/epic-stack/issues/301
// If your tailwind.config.js contains custom classes, then
// you need to create a custom twMerge(). Otherwise, the
// default twMerge() exhibits buggy behavior. For example,
// when I tried using 'text-xxs', it ended up dropping 'text-white'.
// See tailwind.config.js..
// import { twMerge } from 'tailwind.config'

import type { ButtonProps, ButtonRef } from './types'

/* ========================================================================
                              Button
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// What benefit does ButtonPrimitive confer?
//
// - It provides a loading prop with a spinner baked into it.
// - It provides a leftSection & RightSection.
// - The leftSection is replaced by the loader when loading is true.
// - If isIconOnly, children is replaced by the loader when loading is true.
//
// Previously, I created a <Button> that was polymorphic AND allowed the
// consumer to merely pass in a color, size, and variant to configure the
// button's appearance. This ended up being a mistake. It was massively
// overengineered and required that a ton of classes be added to Tailwind's
// safelist.
//
// A better approach is to keep it as simple as possible. For example, it
// doesn't need to be polymorphic. If you ever need a link that looks like
// a button, just use .btn-green, .btn-blue, etc. Also, rather than safelisting
// everything to make the <Button> dynamically configurable, just accept that it's
// essentially a primitive, and instead pass in the classes as needed.
//
// The fact that there is already a buttonPlugin.ts is actually really great. It's
// a nice separation of concerns. In fact, because the button has default CSS
// (other than being display:flex) we don't even need tailwind merge.
//
// Usage:
//
//   The height of a button is a factor of both lineHeight and vertical padding.
//   This allows text to wrap without looking compressed. The trade-off is that
//   isIconOnly implementations will not apply lineHeight if the element is an <svg>.
//   One solution to this is to use a text glyph. The other solution is to add custom
//   padding.
//
//   <Button
//     // loading
//     isIconOnly
//     loadingStyle={{ height: '2em' }}
//     className='btn-green btn-xs p-1'
//   >
//     <svg style={{ height: '2em' }} viewBox='0 0 24 24' fill='none' focusable='false'>
//       <path
//         fill-rule='evenodd'
//         clip-rule='evenodd'
//         d='M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z'
//         fill='currentColor'
//       ></path>
//     </svg>
//   </Button>
//
///////////////////////////////////////////////////////////////////////////

/**
 * <p>In addition to the props explicitly typed, <code>&#60;Button/&#62;</code> can take a ref and any standard React <code>&#60;button&#62;</code> props.</p>
 *
 * @example Basic Implementation
 * ```tsx
 * <Button
 *   className="btn-blue btn-sm"
 *   onClick={() => console.log('Clicked.')}
 * >Click Me<Button>
 * ```
 */

const Button = forwardRef<ButtonRef, ButtonProps>(
  (
    {
      className = '',
      leftSection = null,
      rightSection = null,
      children,
      loading = false,
      loadingClassName = '',
      loadingStyle,
      loader = null,
      isIconOnly,
      disabled = false,
      onClick,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
          getClassName()
    ====================== */

    const getClassName = () => {
      let classes = isIconOnly ? 'btn-is-icon-only' : ''
      if (className) {
        classes = `${classes} ${className}`
      }
      return classes
    }

    /* ======================
        renderLoader()
    ====================== */

    const renderLoader = () => {
      if (!loading) {
        return null
      }

      if (loader) {
        return loader
      }

      return (
        <svg
          // Adjust color and size here as needed.
          className={`block animate-spin${
            loadingClassName ? ` ${loadingClassName}` : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          // Getting SVGs to match the text size is actually stupid simple.
          style={{
            height: '1em',
            ...loadingStyle
          }}
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>

          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      )
    }
    /* ======================
            return
    ====================== */

    return (
      <button
        className={getClassName()}
        ref={ref}
        disabled={disabled || loading}
        {...otherProps}
        onClick={(e) => {
          if (loading || disabled) {
            return
          }
          onClick?.(e)
        }}
      >
        {loading && !isIconOnly ? renderLoader() : leftSection}
        {loading && isIconOnly ? renderLoader() : children}
        {rightSection}
      </button>
    )
  }
)

// Exporting ButtonProps is necessary in order for TypeDoc to be aware of ButtonProps.
// The downside is that it will create a ButtonProps list item in the
// components list.

export { Button, ButtonProps }
