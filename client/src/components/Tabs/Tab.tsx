// Third-party imports
import { ComponentProps, useEffect, forwardRef } from 'react'

// Custom imports
import { useTabsContext } from './TabsContext'

interface ITab extends ComponentProps<'button'> {
  tabKey: string
}

type TabRef = HTMLButtonElement

/* ========================================================================
                                   Tab
======================================================================== */

export const Tab = forwardRef<TabRef, ITab>(
  ({ children, className = '', style = {}, tabKey, ...otherProps }, ref) => {
    const { activeKey, vertical, setActiveKey, setTabKeys, tabCustomization } =
      useTabsContext()

    /* ======================
        handleClick()
  ====================== */

    const handleClick = () => {
      setActiveKey(tabKey)
    }

    /* ======================
     getTabClassName()
  ====================== */

    const getTabClassName = () => {
      let classes = vertical ? 'nav-tabs-button-vertical' : 'nav-tabs-button'

      if (tabKey === activeKey) {
        classes = `${classes} tab-active`
      }

      // tabCustomization is initially derived and assigned to context state within <List />.
      if (tabCustomization) {
        classes = `${classes} ${tabCustomization}`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
        useEffect()
  ====================== */
    // On mount, add the tabKey to tabKeys state.
    // This allows Tabs to fallback to the first tabKey
    // in the list if neither defaultValue (uncontrolled)
    // nor value (controlled) are provided.

    useEffect(() => {
      setTabKeys((prevTabKeys) => {
        return [...prevTabKeys, tabKey]
      })
    }, [tabKey, setTabKeys])

    /* ======================
          return
  ====================== */

    return (
      <button
        ref={ref}
        className={getTabClassName()}
        onClick={handleClick}
        role='tab'
        style={style}
        type='button'
        {...otherProps}
      >
        {children}
      </button>
    )
  }
)
