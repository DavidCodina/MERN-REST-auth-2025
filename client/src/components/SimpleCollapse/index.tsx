// Third-party imports
import { ComponentProps, useState, useEffect } from 'react'

type SimpleCollapseProps = ComponentProps<'div'> & {
  duration?: number
  show: boolean
}

/* ========================================================================
                              SimpleCollapse
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.youtube.com/watch?v=B_n4YONte5A
// https://keithjgrant.com/posts/2023/04/transitioning-to-height-auto/#:~:text=For%20this%20approach%2C%20wrap%20the,max%2Dheight%20work%20inside%20flexbox.
// At it's core this solution is all CSS.
// However, we don't actually want the content container to remain overflow:hidden in it's open state.
// Why? Because then we couldn't apply shadows, or ever use anything that would otherwise pop out
// of the container like a dropdown, etc. Thus, a useEffect() has been added to conditionally
// add/remove this.
//
// I think the Keith Grant article also has a flexbox version...
//
///////////////////////////////////////////////////////////////////////////

export const SimpleCollapse = ({
  children,
  className = '',
  duration = 300,
  show = false,
  style = {},
  ...otherProps
}: SimpleCollapseProps) => {
  const [contentStyle, setContentStyle] = useState(() => {
    if (show) {
      return {}
    }
    return {
      overflow: 'hidden'
    }
  })

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setContentStyle({})
      }, duration)
      return
    }
    setContentStyle({ overflow: 'hidden' })
  }, [duration, show])

  /* ======================
          return
  ====================== */

  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'grid',
        transition: `grid-template-rows ${duration}ms linear`,
        gridTemplateRows: show ? '1fr' : '0fr'
      }}
      {...otherProps}
    >
      <div style={contentStyle}>{children}</div>
    </div>
  )
}
