import { useState, useEffect } from 'react'

///////////////////////////////////////////////////////////////////////////
//
// Solution 1: useThrottle() - i.e., useThrottledValue()
//
// https://github.com/uidotdev/usehooks/blob/main/index.js#L20
// https://usehooks.com/usethrottle
//
// This version will take in a value and update the throttled value based on
// the last value of the unthrottled value at the given interval.
//
// For example, if you button mash a click counter it will increment from 0 to 1, then
// wait for the duration interval, then jump from 1 to whatever the last
// count value was. This in fine if what you want is to allow values to
// skip. However, if you actually want to prevent the original value
// from getting set, then you need a different solution.
//
// export function useThrottle(value: any, interval = 500) {
//   const [throttledValue, setThrottledValue] = useState(value)
//   const lastUpdated = useRef<any>()
//
//   useEffect(() => {
//     const now = Date.now()
//
//     if (now >= lastUpdated.current + interval) {
//       lastUpdated.current = now
//       setThrottledValue(value)
//     } else {
//       const id = window.setTimeout(() => {
//         lastUpdated.current = now
//         setThrottledValue(value)
//       }, interval)
//
//       return () => window.clearTimeout(id)
//     }
//   }, [value, interval])
//
//   return throttledValue
// }
//
/////////////////////////
//
// Solution 2:
//
// One of the problems with using a standard javascript throttle function
// in a React component is that the function instance changes on every render.
// The solution to that might be to wrap it in a useCallback, but then the
// useCallback complains that it has unknown dependencies.
//
// One workaround to this whole issue is to store the function in a ref.
// The downside of this version is that it's not currently possible
// to pass arguments dynamically because the function call gets
// hardcoded into throttle().
//
// const useThrottledFunction = (func: Function, delay: number) => {
//   // https://www.youtube.com/watch?v=1er63_Ki7MI
//   function throttle(func: Function, timeFrame: number) {
//     let lastTime = 0
//     return function () {
//       const now: any = new Date()
//       if (now - lastTime >= timeFrame) {
//         func()
//         lastTime = now
//       }
//     }
//   }
//   const throttledFunctionRef = useRef<Function>(throttle(func, delay))
//   return throttledFunctionRef.current
// }
//
/////////////////////////
//
// Solution 3:
//
// This version is super simple in that all it does is wrap the function
// in another function that itself returns early if !shouldRun. This
// implementation also allows arguments to be passed dynamically, and
// it also returns a shouldRun value that can be used to set
// loading/disabled states.
//
///////////////////////////////////////////////////////////////////////////

export const useThrottledFunction = (func: any, delay = 500) => {
  const [shouldRun, setShouldRun] = useState(true)

  useEffect(() => {
    if (!shouldRun) {
      setTimeout(() => {
        setShouldRun(true)
      }, delay)
    }
  }, [shouldRun, delay])

  const throttledFunction = (...args: any[]) => {
    if (shouldRun === true) {
      setShouldRun(false)
      return func(...args)
    }
  }

  type ThrottledFunction = typeof throttledFunction
  type UseThrottledFunctionReturnType = [ThrottledFunction, boolean]

  return [throttledFunction, shouldRun] as UseThrottledFunctionReturnType
}
