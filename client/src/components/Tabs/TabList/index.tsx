import { useEffect, forwardRef } from 'react'

// Custom imports
import { useTabsContext } from '../TabsContext'
import { ITabList, TabListRef } from './types'

/* ========================================================================
                                  TabList
======================================================================== */

export const TabList = forwardRef<TabListRef, ITabList>(
  (
    { center, navFill, navJustified, right, children, style, className },
    ref
  ) => {
    const { setTabCustomization, vertical } = useTabsContext()

    ///////////////////////////////////////////////////////////////////////////
    //
    // center, and right are only applied to the horizontal (!vertical) orientation.
    // center and right should NOT be used in conjunction.
    // If used in conjunction, center will have precedence over right.
    //
    // Note: If navFill or navJustified are applied to Tab components, then neither center
    // nor right props will have any noticeable effect here. That said, their presence won't
    // negatively affect anything either.  That said, we could still omit them if either
    // navFill or navJustified are true.
    //
    ///////////////////////////////////////////////////////////////////////////

    const omitCenterRight = vertical || navFill || navJustified
    const justifyContent =
      center && !omitCenterRight
        ? 'center'
        : right && !omitCenterRight
          ? 'end'
          : ''

    /* ======================
     getListClassName()
  ====================== */

    const getListClassName = () => {
      let classes = vertical ? 'nav-tabs-vertical' : 'nav-tabs'

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
        useEffect()
  ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // On mount set tabCustomization based on value of navFill, navJustified and vertical props.
    // vertical has precedence over navFill and navJustified.
    // navFill and navJustified should not be used in conjunction.
    // That said, navFill has precedence over navJustified.
    //
    // Arguably, one could've passed navFill and navJustified directly into the top-level <Tabs>.
    // However, conceptually, it seems like it makes more sense on the consuming side to have
    // navFill, navJustified, center and right all as props on <List>.
    //
    ///////////////////////////////////////////////////////////////////////////

    const tabCustomization =
      navFill && !vertical
        ? 'nav-fill'
        : navJustified && !vertical
          ? 'nav-justified'
          : ''
    useEffect(() => {
      setTabCustomization(tabCustomization)
    }, [setTabCustomization, tabCustomization])

    /* ======================
          return
  ====================== */

    return (
      <nav
        ref={ref}
        className={getListClassName()}
        role='tablist' // eslint-disable-line
        style={{
          ...style,
          justifyContent
        }}
      >
        {children}
      </nav>
    )
  }
)
