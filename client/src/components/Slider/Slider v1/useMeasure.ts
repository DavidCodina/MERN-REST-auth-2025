import { useState, useRef, useCallback } from 'react'

/* ========================================================================
                                  useMeasure()
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The Sam Selikoff tutorial used this hook: https://www.npmjs.com/package/react-use-measure
// But I went with a similar one found here:
//
//   https://usehooks.com/usemeasure
//   https://github.com/uidotdev/usehooks/blob/main/index.js
//
// It seems to do the same thing, but is more concise.
//
///////////////////////////////////////////////////////////////////////////

export const useMeasure = (): [
  (node: any) => void,
  {
    width: number
    height: number
  }
] => {
  const [dimensions, setDimensions] = useState({
    width: 0, //^ was null,
    height: 0 //^ was null
  })

  const previousObserver = useRef<ResizeObserver | null>(null)

  // https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs#callback-refs
  const callbackRef = useCallback((node: HTMLElement | null) => {
    if (previousObserver.current) {
      previousObserver.current.disconnect()
      previousObserver.current = null
    }

    if (node?.nodeType === Node.ELEMENT_NODE) {
      const observer = new ResizeObserver(([entry]) => {
        if (entry && entry.borderBoxSize) {
          const borderBoxSize = entry.borderBoxSize[0] // as ResizeObserverSize

          if (borderBoxSize) {
            const { inlineSize: width, blockSize: height } = borderBoxSize
            setDimensions({ width, height })
          }
        }
      })

      observer.observe(node)
      previousObserver.current = observer
    }
  }, [])

  return [callbackRef, dimensions]
}
