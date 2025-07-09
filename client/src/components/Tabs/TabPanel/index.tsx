// Third-party imports
import { CSSProperties, ReactNode, ComponentProps, forwardRef } from 'react'

// Custom imports
import { useTabsContext } from '../TabsContext'
import { Spinner } from './Spinner'

interface ITabPanel extends ComponentProps<'div'> {
  loading?: boolean
  /** Consumer may pass in their own loader. */
  loader?: ReactNode
  /** The unique identifier for each Tab. It should match the tabKey in the associated `<Tabs.Tab>`. */
  tabKey: string
}

type TabPanelRef = HTMLDivElement

/* ========================================================================
                                  TabPanel
======================================================================== */

export const TabPanel = forwardRef<TabPanelRef, ITabPanel>(
  (
    { children, className = '', tabKey, loader = null, loading, style = {} },
    ref
  ) => {
    const { activeKey, keepMounted } = useTabsContext()
    const isCurrent = tabKey === activeKey

    const displayStyle: CSSProperties = isCurrent
      ? {}
      : {
          // display:'none' is fine here. It won't unmount the children.
          display: 'none'

          ///////////////////////////////////////////////////////////////////////////
          //
          // Alternate approach if you needed to make DOM measurements:
          //
          // The next two rules are similar to the ones used by Bootsrap's .btn-check,
          // which is essentially a subset of Bootstrap's .visually-hidden. However,
          // .visually-hidden does not preserve the ability to make DOM measurements.
          //
          // clip: 'rect(0, 0, 0, 0)',
          // position: 'absolute',
          // pointerEvents: 'none'
          //
          // Presumably, we also want to hide the content from assistive technologies,
          // as if it were unmounted. Thus, we ALSO need to use visibility: 'hidden'.
          // The overall goal is to hide the inactive content, but no unmount it. Why?
          // In some cases the Tab content may be a separate component that has its own
          // API calls on mount, and we don't want to repeatedly make those network requests.
          //
          // visibility: 'hidden'
          //
          ///////////////////////////////////////////////////////////////////////////
        }

    /* ======================
        renderContent()
  ====================== */

    const renderContent = () => {
      if (loading) {
        if (loader) {
          return loader
        } else {
          //return <Loader />
          return (
            <div className='flex items-center justify-center py-12'>
              <Spinner style={{ height: 60 }} />
            </div>
          )
        }
      }
      return children
    }

    /* ======================
          return
  ====================== */

    if (!isCurrent && !keepMounted) {
      return null
    }

    return (
      <div
        ref={ref}
        className={`tab${className ? ` ${className}` : ''}`}
        style={{
          ...style,
          ...displayStyle
        }}
      >
        {renderContent()}
      </div>
    )
  }
)
