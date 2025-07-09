// Third-party imports
import { useRef } from 'react'

export const useRunOncePerMount = (func: () => any) => {
  const hasRunOnceRef = useRef(false)

  return () => {
    if (hasRunOnceRef.current === true) {
      console.log('This function has already run once.')
      return
    }
    const value = func()
    hasRunOnceRef.current = true
    return value
  }
}

// Usage:
//
// const runOncePerMount = useRunOncePerMount(() => {
//   console.log('Running once!')
//   return { hasRun: true }
// })
//
// ...
//
// <button
//   onClick={() => {
//     const value = runOncePerMount()
//     console.log('Return value', { value })
//   }}
// >
//   CLICK ME{' '}
// </button>
