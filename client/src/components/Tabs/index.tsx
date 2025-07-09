import { ComponentProps, forwardRef } from 'react'
import { TabsProvider, ITabsProvider } from './TabsContext'
import { TabList } from './TabList' // AKA, NavList
import { Tab } from './Tab' // AKA NavListTabItem
import { TabPanel } from './TabPanel' // AKA TabContent

export interface ITabs
  extends ITabsProvider,
    Omit<ComponentProps<'div'>, 'onChange' | 'children' | 'defaultValue'> {}

type TabsRef = HTMLDivElement

/* ========================================================================
                
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Tabs was superficially influenced by Mantine Tabs:
// https://mantine.dev/core/tabs/
// However, it would be worth actually reviewing the source code as well.
// This Tabs implementation is solid, but I would still go with Mantine or Radix
// in production.
//
// Next Steps:
//
//   1. Review Mantine, Tailwind UI, Radix, and ShadCDN to see about improvements.
//
//   2. I'm also curious to see what other Tabs look like when they need to wrap.
//
//   3. Review this: https://mantine.dev/core/tabs/#usage-with-react-router
//
//   4. Eventually add keyboard interactions: https://mantine.dev/core/tabs/#keyboard-interactions
//
///////////////////////////////////////////////////////////////////////////

const TabsWithProvider = forwardRef<TabsRef, ITabs>(
  (
    {
      children,
      className = '',
      defaultValue = '',
      keepMounted = true,
      style = {},
      vertical = false,
      value = '',
      onChange,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
          style
  ====================== */

    if (vertical) {
      style = {
        ...style,
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        display: 'flex'
      }
    } else {
      style = {
        ...style,
        boxSizing: 'border-box'
      }
    }

    /* ======================
          return
  ====================== */

    return (
      <TabsProvider
        defaultValue={defaultValue}
        keepMounted={keepMounted}
        value={value}
        onChange={onChange}
        vertical={vertical}
      >
        <div
          ref={ref}
          className={className ? `tabs ${className}` : 'tabs'}
          style={style}
          {...otherProps}
        >
          {children}
        </div>
      </TabsProvider>
    )
  }
)

///////////////////////////////////////////////////////////////////////////
//
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34757
// Once we wrap the component in forwardRef, it becomes more difficult
// to get Typescript to allow adding properties onto the component:
//
// ❌ TabsWithProvider.List === TabList
// Property 'List' does not exist on type 'ForwardRefExoticComponent<Omit<ITabs, "ref"> & RefAttributes<HTMLDivElement>>'.
//
// Object.assign()  does not cause the same type issues as trying
// to append new properties. This is the way.
//
///////////////////////////////////////////////////////////////////////////

const CompoundComponent = Object.assign(TabsWithProvider, {
  List: TabList,
  Tab: Tab,
  Panel: TabPanel
})

export { CompoundComponent as Tabs, TabList, Tab, TabPanel }
