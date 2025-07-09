import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { ICollapse } from './types'

/* ========================================================================
                                Collapse
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Initially, I converted this from styled-components to Tailwind.
// The conversion presented unique challenges because my TW config was/is
// using 'important: true', which conflicted with some of the programmatic
// settings I make here. Ultimately, I fixed all that but also realized
// it would just take one more step to make this entirely independent from
// any library.
//
// Currently this collapse does not hook into prefers reduced motion in any way:
//
//   @media (prefers-reduced-motion: reduce) {
//     .collapsing { transition: none; }
//   }
//
///////////////////////////////////////////////////////////////////////////

export const Collapse = forwardRef<any, ICollapse>(
  (
    {
      children,
      className = '',
      disableTransition = false,
      duration = 300,
      isOpen = false,
      style = {}
    },
    ref
  ) => {
    /* ======================
        state & refs
  ====================== */

    const collapseRef = useRef<HTMLDivElement | null>(null)
    const offsetHeightRef = useRef(0)
    const firstRenderRef1 = useRef(true)
    const firstRenderRef2 = useRef(true)
    const [isCollapsing, setIsCollapsing] = useState(false)

    ///////////////////////////////////////////////////////////////////////////
    //
    // New The idea here is that the component will use the forwarded ref
    // if one is provided. Otherwise, it will use internalRef:
    //
    //   const collapseRef = (ref ? ref : internalRef) as React.MutableRefObject<HTMLDivElement | null>
    //
    // This approach seems to work fine, but likely will not support callback refs.
    // Note: a forwardedRef will also trigger dependency arrays.
    // In order to use BOTH internal and external refs and NOT trigger dependency
    // arrays, we can do this instead.
    //
    ///////////////////////////////////////////////////////////////////////////

    useImperativeHandle(
      // This is the ref that we want to completely override.
      // Basically it now becomes the second argument. And in
      // the second argument we are actually providing a referrence
      // to the intended HTMLDivElement, but doing it THROUGH
      // the internal collapseRef.
      ref,
      () => {
        return { current: collapseRef.current }
      },
      []
    )

    /* ======================
          setHeight()
    ====================== */
    // Get scrollHeight and set height to scrollHeight.

    const setHeight = () => {
      if (collapseRef?.current === null) {
        return
      }
      const scrollHeight = `${collapseRef?.current.scrollHeight}px`
      collapseRef.current.style.height = scrollHeight
    }

    /* ======================
        forceReflow()
  ====================== */
    // This function prevents DOM batching by forcing reflow.
    // One way this can be done is by checking offsetHeight.

    const forceReflow = () => {
      if (collapseRef?.current === null) {
        return
      }
      ///////////////////////////////////////////////////////////////////////////
      //
      // Sometimes one can get away with just doing: void collapseRef.current.offsetHeight.
      // However, that wont' work in the some environments (i.e., TSdx, parcel, etc).
      //
      // Presumably because the bundler is removing unused code. The result is that
      // it sees the void statement and deletes it - as if it was never written.
      // Here's the workaround:
      //
      ///////////////////////////////////////////////////////////////////////////

      const forceReflow = collapseRef?.current.offsetHeight

      if (typeof forceReflow === 'number') {
        // If the closing animation isn't working, then it's possible that
        // forceReflow is getting deleted still. Another solution would be to
        // do: console.log('') inside of the if statement.
        offsetHeightRef.current = forceReflow
      }
    }

    /* ======================
     useLayoutEffect()
  ====================== */
    // I was getting a blink every 1 in 10 times when first.
    //  opening. useLayoutEffect resolved it.

    useLayoutEffect(() => {
      let collapsingTimeout: any

      // Return early on mount (i.e, avoid first render).
      // What this really does is prevent the transition effect
      // from running when isOpen is true on mount.
      if (firstRenderRef1.current === true) {
        firstRenderRef1.current = false
        return
      }

      // Opening...
      if (isOpen) {
        setIsCollapsing(true)
        collapsingTimeout = setTimeout(() => {
          setIsCollapsing(false)
        }, duration)
      }

      // Closing...
      if (!isOpen) {
        setHeight()
        setIsCollapsing(true)
        collapsingTimeout = setTimeout(() => {
          setIsCollapsing(false)
        }, duration)
      }

      return () => {
        clearTimeout(collapsingTimeout)
      }
    }, [isOpen, duration, disableTransition])

    /* ======================
        useEffect()
  ====================== */
    ////////////////////////////////////////////////////////////////////////////////
    //
    // This useEffect sets/unsets the height & overflow programmatically as needed.
    // This part must happen synchronously, AFTER the collapseClasses have been
    // set.
    //
    // Why? Because setHeight() relies on collapseRef.current.scrollHeight,
    // which can only be read when not display: none. When the component
    // has has display: none, it makes it impossible to get the scrollHeight.
    //
    ////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
      // Return early on mount (i.e, avoid first render).
      if (firstRenderRef2.current === true) {
        firstRenderRef2.current = false
        return
      }

      if (collapseRef.current === null) {
        return
      }

      // Renders 3x:
      //   1x : {isOpen: true, isCollapsing: false}
      //   2x : {isOpen: true, isCollapsing: true}
      //   3x : {isOpen: true, isCollapsing: false}

      // Opening...
      if (isOpen) {
        if (isCollapsing) {
          collapseRef.current.style.overflow = 'hidden'
          collapseRef.current.style.height = '0'
          setHeight()
        } else {
          collapseRef.current.style.overflow = ''
          collapseRef.current.style.height = ''
        }
      }

      // Closing...
      if (!isOpen) {
        if (isCollapsing) {
          setHeight()
          ////////////////////////////////////////////////////////////////////////////////
          //
          // Gotcha: In React v18 forcing reflow seems not to be necessary.
          // However, in v17 this part is important. Forcing reflow prevents
          // batching DOM updates.
          //
          ////////////////////////////////////////////////////////////////////////////////
          forceReflow()

          collapseRef.current.style.height = '0'
          collapseRef.current.style.overflow = 'hidden'
        } else {
          collapseRef.current.style.height = ''
          collapseRef.current.style.overflow = ''
        }
      }
    }, [isOpen, isCollapsing])

    /* ======================
          return
  ====================== */

    return (
      <div
        className={`${className ? ` ${className}` : ''}`}
        ref={collapseRef}
        style={{
          ...style,
          display: !isCollapsing && !isOpen ? 'none' : '',
          transitionDuration: `${duration}ms`,
          transitionProperty: disableTransition ? 'none' : 'height',
          transitionTimingFunction: 'linear',
          padding: 0 // Hardcode no padding to prevent breaking the fluidity of the Collapse effect.
        }}
      >
        {children}
      </div>
    )
  }
)

/* Usage:

<Button
  className='block mx-auto my-5'
  color='green'
  onClick={() => { setOpen((v) => !v) }}
>Toggle Collapse</Button>

<Collapse isOpen={open} duration={300}>
  <div className='bg-white p-3 border border-gray-600 rounded-lg'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
  </div>
</Collapse>
*/
