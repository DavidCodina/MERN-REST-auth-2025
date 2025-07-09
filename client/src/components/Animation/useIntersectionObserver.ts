import { RefObject, useEffect, useState, useRef } from 'react'

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
  onChange?: (entry: IntersectionObserverEntry) => void
  skip?: boolean
  delay?: number
}

/* ========================================================================

======================================================================== */
// The onChange implemenation here was inspired by:
// https://github.com/thebuilder/react-intersection-observer/blob/main/src/useInView.tsx
// I tried to implement a delay, but that's when thing get really weird.
// Somehow react-intersection-observer does a really good job of deduplicating the timeout.
// That said, I looked at the source code and I couldn't even track what happens to the delay
// option. This is why I'd opt for the react-intersection-observer over this simplified hook.
// react-intersection-observer also deals with some browser-compatibility issues as well as
// caching the observer.

export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    onChange,
    skip = false,
    // https://css-tricks.com/an-explanation-of-how-the-intersection-observer-watches/
    // delay will work in Chrome/Edge, but not Safari/Firefox
    delay = 0
  }: Args
): {
  entry: IntersectionObserverEntry | undefined
  observer: IntersectionObserver | undefined
} {
  /* ======================
        state & refs
  ====================== */

  const [observer, setObserver] = useState<IntersectionObserver>()
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const callback = useRef<Args['onChange']>(undefined)

  // Store the onChange callback in a `ref`, so we can access the latest instance
  // inside the `useEffect`, but without triggering a rerender.
  callback.current = onChange

  // Derived state
  const frozen = entry?.isIntersecting && freezeOnceVisible

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node || skip) {
      return
    }

    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
      if (entry && typeof callback.current === 'function') {
        callback.current(entry)
      }
      // Fire callback above, THEN make state change to trigger rerender.
      setEntry(entry)
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Strangely, nowwhere within MDN docs or even the IntersectionObserver types
    // does it say anything about delay, but for some reason it works.
    //
    // https://css-tricks.com/an-explanation-of-how-the-intersection-observer-watches/
    // There are some differences in how a few of the properties are displayed, such as target and prototype,
    // but they operate the same in both browsers. What’s different is that Chrome has a few extra
    // properties that don’t appear in Firefox. The observer object has a boolean called trackVisibility,
    // a number called delay, and the entry object has a boolean called isVisible.
    // These are the newly proposed properties that attempt to determine whether the target
    // element is actually visible to the user.
    //
    ///////////////////////////////////////////////////////////////////////////
    const observerParams = { threshold, root, rootMargin, delay }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)
    setObserver(observer)

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRef?.current,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(threshold) ? threshold.toString() : threshold, // Or use JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    skip
  ])

  return { entry, observer }
}
