// Third-party imports
import { useRef, useCallback, useState } from 'react'

/* ======================
      useCycle()
====================== */
// This is the same as the one exported from 'framer-motion'.
// I just wanted to localize it.

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export function useCycle(...items: any[]) {
  const index = useRef(0)
  const [item, setItem] = useState(items[index.current])

  const runCycle = useCallback(
    (next: number | undefined) => {
      index.current =
        typeof next !== 'number'
          ? wrap(0, items.length, index.current + 1)
          : next
      setItem(items[index.current])
    },
    // The array will change on each call, but by putting items.length at
    // the front of this array, we guarantee the dependency comparison will match up
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, ...items]
  )

  return [item, runCycle]
}
