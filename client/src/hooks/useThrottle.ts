import { useEffect, useRef, useState } from 'react'

/* ======================
      useThrottle()
====================== */
// https://usehooks.com/usethrottle
// https://github.com/uidotdev/usehooks/blob/main/index.js#L20

export function useThrottle(value: any, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated = useRef<any>(undefined)

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now
        setThrottledValue(value)
      }, interval)

      return () => window.clearTimeout(id)
    }
  }, [value, interval])

  return throttledValue
}
