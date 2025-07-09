import {
  ComponentProps,
  useState,
  useEffect,
  forwardRef,
  Fragment
} from 'react'

import { OffCanvasCloseButton } from './OffCanvasCloseButton'
import { OffCanvasBackdrop } from './OffCanvasBackdrop'
import { openOrClose } from './utils'

import { useClickOutside } from './useClickOutside'

type Ref = HTMLDivElement

interface IOffCanvas extends Omit<ComponentProps<'div'>, 'onChange'> {
  disableBackdrop?: boolean
  disableBodyClick?: boolean
  disableScrollLock?: boolean
  placement?: 'start' | 'end' | 'top' | 'bottom'
  value: boolean
  onChange: (newValue: boolean) => void
  /** Transition duration in milliseconds. */
  duration?: number
  backdropDuration?: number
}

/* ========================================================================
                                OffCanvas
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Add feature that automatically shows the .offCanvas when min-width is reached.
// This feature should NOT overwrite the value of value, but should override it.
// The prop could be called something like showBreakpoint which takes in a number
// representing the min-width of the viewport.
//
// When this happens several things need to occur.
//
//   - The scroll lock and backdrop and body click need to be turned off and then disabled.
//
//   - The actual content needs to be pushed to the appropriate side.
//     This will likely entail changing the implementation of the OffCanvas, so
//     it contains all content as a parent element.
//
//   - A better idea might be to leave OffCanvas as it is, but have an OffCanvas.Container
//     This component would actually wrap both OffCanvas and the layout content. It would
//     Then control the chanes to OffCanvas and the layout.
//
///////////////////////////////////////////////////////////////////////////

//# Add this back to Vite project ASAP (changing menu implentation as well).
//# I've updated MainLayout and  Menu and added useThrottle to hooks.
//# I've also changed Navicon1's zIndex.

const OffCanvas = forwardRef<Ref, IOffCanvas>(
  (
    {
      backdropDuration: overlayDuration,
      children,
      className = '', // Used primarily to extend OffCanvas through styled-components.
      disableBackdrop = false,
      disableBodyClick = false,
      disableScrollLock = false,
      duration = 300,
      onChange,
      placement = 'start',
      style = {},
      value
    },
    ref
  ) => {
    duration = typeof duration === 'number' ? duration : 300

    // Typescript kept thinking it could possibly be undefined.
    // The hack is to alias the backdropDuration prop.
    const backdropDuration =
      typeof overlayDuration === 'number'
        ? overlayDuration
        : typeof duration === 'number'
          ? duration * 2.5 // By default this is 750.
          : 750

    /* ======================
          state & refs
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // Initially, I throttled the incoming value and used throttledValue everywhere
    // in its place:
    //
    //   const throttledValue = useThrottle(value, duration)
    //
    // The problem there is that the Navicon then can still trigger super fast
    // even though the menu is being throttled. They don't get out of sync in the
    // end, but it still seems wrong. The actual solution is to throttle the state
    // in the consuming code. Thus, in MainLayout do this:
    //
    //   const duration = 200
    //   const [showMenu, setShowMenu] = useState(false)
    //   const throttledShowMenu = useThrottle(showMenu, duration)
    //
    //   <Navicon1
    //     data-toggle='offcanvas'
    //     iconClassName={`text-blue-500 dark:text-[var(--dark-primary-color)]`}
    //     onClick={() => setShowMenu((v) => !v)}
    //     show={throttledShowMenu}
    //     style={{ position: 'absolute', top: 10, right: 10 }}
    //   />
    //
    //   <Menu
    //     duration={duration}
    //     showMenu={throttledShowMenu}
    //     setShowMenu={setShowMenu}
    //   />
    //
    ///////////////////////////////////////////////////////////////////////////

    // The Mantine docs explicitly indicate that the node should be maintained
    // through useState and not useRef, "Will work only with useState, not useRef".
    // That said, useRef seemed to work fine...
    const [offCanvas, setOffCanvas] = useState<HTMLDivElement | null>(null)

    const nodesToIgnore = [
      offCanvas,
      ...document.querySelectorAll('[data-toggle="offcanvas"]')
      // Typescript doesn't trust that the array is of HTML elements.
    ].filter((node) => node instanceof HTMLElement) as HTMLElement[]

    // Modified Mantine Hook: useClickOutside
    // useClickOutside has two different implementation styles.
    // When you pass nodes, you must include a ref to the primary HTMLElement
    // as well as any other elements to ignore. Conversely, when not using nodes
    // the return will be a ref that you can assign to the primary HTMLElement.
    useClickOutside({
      disabled: disableBodyClick,
      handler: () => onChange(false),
      // Ignore all offcanvasToggles to prevent double-toggling (e.g., the Navicon).
      nodes: nodesToIgnore
    })

    const [offCanvasClassName, setOffCanvasClassName] = useState(
      `offcanvas offcanvas-${placement}${className ? ` ${className}` : ''}`
    )

    // Used to conditionally show/hide the overlay. This is useful in
    // order to offset the hiding after the value prop becomes false.
    const [showBackdrop, setShowBackdrop] = useState(false)

    /* ======================
          useEffect()
    ====================== */
    // This useEffect() watches for changes to value. When value changes,
    // it calls openOrClose() which sets offCanvasClassName accordingly.

    useEffect(() => {
      openOrClose({
        className,
        duration,
        placement,
        setOffCanvasClassName,
        value
      })
    }, [className, duration, placement, value])

    /* ======================
          useEffect()
    ====================== */
    // This useEffect() handles the scroll lock.

    useEffect(() => {
      const body = document.getElementsByTagName('body')[0]

      if (!body) {
        return
      }

      if (value === false || disableScrollLock) {
        body.style.overflow = ''
        return
      }

      if (value === true) {
        body.style.overflow = 'hidden'
      }

      return () => {
        body.style.overflow = ''
      }
    }, [disableScrollLock, value])

    /* ======================
          useEffect()
    ====================== */
    // This useEffect() handles the backdrop implementation,
    // which conditionaly mounts/unmounts <OffCanvasBackdrop />.

    useEffect(() => {
      let timeout: NodeJS.Timeout

      if (disableBackdrop) {
        return
      }
      if (value === true) {
        setShowBackdrop(true)
      } else if (value === false) {
        timeout = setTimeout(() => {
          setShowBackdrop(false)
        }, backdropDuration)
      }

      return () => clearTimeout(timeout)
    }, [disableBackdrop, backdropDuration, value])

    /* ======================
            return
    ====================== */

    return (
      <Fragment>
        {showBackdrop && (
          <OffCanvasBackdrop
            backdropDuration={backdropDuration}
            value={value}
          />
        )}

        <div
          className={offCanvasClassName}
          ref={(node) => {
            if (ref && 'current' in ref) {
              ref.current = node
            } else if (typeof ref === 'function') {
              ref?.(node)
            }
            setOffCanvas(node)
          }}
          style={{
            ...style,
            ...(typeof duration === 'number'
              ? { transitionDuration: `${duration}ms` }
              : {})
          }}
          tabIndex={-1}
        >
          {children}
        </div>
      </Fragment>
    )
  }
)

const CompoundComponent = Object.assign(OffCanvas, {
  CloseButton: OffCanvasCloseButton
})

export { CompoundComponent as OffCanvas, OffCanvasCloseButton }
