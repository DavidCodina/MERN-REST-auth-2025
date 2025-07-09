// Third-party imports
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { IRadixScrollArea } from './types'

/* ========================================================================
                              RadixScrollArea
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/components/scroll-area
// This ScrollArea is so much nicer to work with than overlayscrollbars-react
// because it does not depend on a separate CSS file.
//
///////////////////////////////////////////////////////////////////////////

export const RadixScrollArea = ({
  children,
  className,
  style,
  horizontal = true,
  vertical = true,
  scrollHideDelay = 0 // Radix defaults to 600
}: IRadixScrollArea) => {
  /* ======================
      renderViewportr()
  ====================== */
  // Because the scrollbar is implemented as an overlay, there is no reason
  // to expose a viewportClassName or viewportStyle prop. Instead, just use
  // the className and style that are applied to the ScrollArea.Root.

  const renderViewport = () => {
    return (
      <ScrollArea.Viewport className='radix-scrollarea-viewport'>
        {children}
      </ScrollArea.Viewport>
    )
  }

  /* ======================
  renderVerticalScrollBar()
  ====================== */

  const renderVerticalScrollBar = () => {
    if (!vertical) {
      return null
    }
    return (
      <ScrollArea.Scrollbar
        className='radix-scrollarea-scrollbar'
        orientation='vertical'
      >
        <ScrollArea.Thumb className='radix-scrollarea-thumb' />
      </ScrollArea.Scrollbar>
    )
  }

  /* ======================
  renderHorizontalScrollBar()
  ====================== */

  const renderHorizontalScrollBar = () => {
    if (!horizontal) {
      return null
    }
    return (
      <ScrollArea.Scrollbar
        className='radix-scrollarea-scrollbar'
        orientation='horizontal'
      >
        <ScrollArea.Thumb className='radix-scrollarea-thumb' />
      </ScrollArea.Scrollbar>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <ScrollArea.Root
      className={`radix-scrollarea-root${className ? ` ${className}` : ''}`}
      style={style}
      scrollHideDelay={scrollHideDelay}
    >
      {renderViewport()}
      {renderVerticalScrollBar()}
      {renderHorizontalScrollBar()}
      <ScrollArea.Corner className='radix-scrollarea-corner' />
    </ScrollArea.Root>
  )
}
