import { ComponentProps } from 'react'

interface IPlaceholder extends ComponentProps<'div'> {
  animation?: 'glow' | 'shine' | 'white-wave' | 'wave'
  /** Like size, color is merely for convenience. color can otherwise
   * be set through style or className props.
   */
  color?: string
  /** Sets the associated CSS class for `placeholder-${size}`,
   * with min-height's of 5px, 10px, 20px and 25px respectively.
   * This is mostly just for convenience as one could also set minHeight through
   * the className or style prop. */
  size?: 'xs' | 'sm' | 'lg' | 'xl'
}

/* =============================================================================
                                  Placeholder
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// The react-bootstrap version uses xs, sm, md, xl, xxl props to set the width.
// Each of the props can take in a number from 1 to 12, this will set the
// length of the Placeholder to that many grid units.
//
// However, react-bootstrap also allows for an alternate approach whereby
// the user can set style={{ width: '75%' }}. While this is not responsive,
// it does allow the user to have a more specific amount. This is the
// approach that has been taken for this Placeholder. If at some point, we
// also want to add in the grid props, then we can do that later.
// By default, each line will be set to a width of 100%.
//
// A shape prop has been omitted, since it's relatively easy to style shapes
// using the style prop.
//
// By default, the background-color is 0.5 opacity of the currentColor.
//
// Placeholder by itself is not very impressive. The idea is that it's
// used to compose more elaborate skeletons that are themselves reusable.
//
// The only problem with the use of currentColor to set the default backgroundColor,
// is when you go to dark mode and the currentColor actually becomes '#fff'. This issue
// may warrant rethinking the implementation.
//
// See also:
//
//   https://ui.shadcn.com/docs/components/skeleton
//   https://www.npmjs.com/package/react-placeholder-loading
//
////////////////////////////////////////////////////////////////////////////////

export const Placeholder = ({
  animation,
  className = '',
  color = '',
  size,
  style = {},
  ...otherProps
}: IPlaceholder) => {
  /* ======================
        getClasses()
  ====================== */

  const getClasses = () => {
    let classes = 'placeholder'

    if (size === 'xs') {
      classes = `${classes} placeholder-xs`
    } else if (size === 'sm') {
      classes = `${classes} placeholder-sm`
    } else if (size === 'lg') {
      classes = `${classes} placeholder-lg`
    } else if (size === 'xl') {
      classes = `${classes} placeholder-xl`
    }

    if (animation === 'glow') {
      classes = `${classes} placeholder-glow`
    } else if (animation === 'wave') {
      classes = `${classes} placeholder-wave`
    } else if (animation === 'white-wave') {
      classes = `${classes} placeholder-white-wave`
    } else if (animation === 'shine') {
      classes = `${classes} placeholder-shine`
    }

    if (className) {
      classes = `${classes} ${className}`
    }

    return classes
  }

  /* ======================
          return
  ====================== */

  return (
    <div
      className={getClasses()}
      style={{
        ...style,
        // By setting backgroundColor: color, we are ensuring that this
        // has precedence over setting the actual color property in the style prop.
        ...(color ? { backgroundColor: color } : {})
        // We could also add this, but it's actually not needed.
        // ...(color ? {  color } : {})
      }}
      {...otherProps}
    />
  )
}
