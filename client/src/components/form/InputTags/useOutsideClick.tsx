import { useEffect, RefObject } from 'react'
type Func = (...args: any[]) => void

/* ========================================================================

======================================================================== */
// Usage: useOutsideClick(modalRef, cb)

export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  callback: Func
) => {
  useEffect(() => {
    const listener = (event: any) => {
      // DO NOTHING if the element being clicked is the target element or their children
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      callback(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
    // eslint-disable-next-line
  }, [ref])
}
