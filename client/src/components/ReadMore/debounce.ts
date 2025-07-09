/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Bard prompt: Create a typescript debounce function.
//
// Explanation:
//
//   - The function takes the original function to be debounced,
//     the delay in milliseconds, and an optional options object.
//
//   - The options object allows you to specify whether to execute the
//     function immediately on the first call (leading execution) and whether
//     to cancel any pending calls when calling with leading execution.
//
//   - A timeoutId is used to store the reference to the pending timeout.
//
//   - When the debounced function is called, any existing timeout is cleared.
//
//   - If leading execution is enabled and there is no pending timeout, the original
//     function is immediately called with the arguments.
//
//   - A new timeout is set to call the original function after the specified delay with the arguments.
//
//   - If cancelOnLeading is true and a new call is made while a leading execution
//     is pending, the pending call is canceled.
//
// This function allows you to easily create reusable debounced functions in your Typescript projects.
//
// Additional Notes:
//
//   - You can adapt this function to accept specific types for the function arguments and return value.
//
//   - Consider using clearTimeout before assigning a new value to timeoutId to avoid potential memory leaks.
//
// Notes of Interest:
//
// We don't want to use Function as a type:  eslint(@typescript-eslint/ban-types)
// See also: https://www.totaltypescript.com/dont-use-function-keyword-in-typescript
// In the above article Matt Pocock suggests
//
//   "If you do want to represent a function that can take any number of arguments,
//   and return any type, use (...args: any[]) => any."
//
// And this is precisely what Bard did when it generated the debounce function.
//
///////////////////////////////////////////////////////////////////////////

export const debounce = <F extends (...args: any[]) => any>(
  fn: F,
  delay: number,
  { leading = false, cancelOnLeading = false } = {}
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId)

    // leading is false by default.
    if (leading && !timeoutId) {
      fn(...args)
    }

    timeoutId = setTimeout(() => {
      if (!cancelOnLeading || !timeoutId) {
        fn(...args)
      }
    }, delay)
  }
}

// Example Usage:
// const logDebounced = debounce((message: string) => console.log(message), 500)
// logDebounced('Debouncing this!')                       // Logs immediately (leading execution)
// logDebounced('Still debouncing...')                    // Will not log due to cancellation
// setTimeout(() => logDebounced('Finally logged!'), 700) // Logs after delay
