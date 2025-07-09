import { useEffect, useState, useRef } from 'react'

/* ========================================================================
                   useDebouncedValue (i.e., useControlledDebounce)
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This hook was originally taken from:
//
//   https://mantine.dev/hooks/use-debounced-value/
//   https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-debounced-value/use-debounced-value.ts
//
// use-debounced-value hook debounces value changes. This can be useful in case you want to perform a
// heavy operation based on react state, for example, send search request. Unlike use-debounced-state
// it is designed to work with controlled components.
//
// Differences from use-debounced-state
//
//   - You have direct access to the non-debounced value.
//
//   - It is used for controlled inputs (value prop instead of defaultValue),
//     e.g. renders on every state change like a character typed in an input.
//
//   - It works with props or other state providers, and it does not force use of useState.
//
///////////////////////////////////////////////////////////////////////////

export function useDebouncedValue<T = any>(
  value: T,
  wait: number,
  options = { leading: false }
) {
  const [_value, setValue] = useState(value)
  const mountedRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  const cooldownRef = useRef(false)

  const cancel = () => window.clearTimeout(timeoutRef.current!)

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true
        setValue(value)
      } else {
        cancel()
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false
          setValue(value)
        }, wait)
      }
    }
  }, [value, options.leading, wait])

  useEffect(() => {
    mountedRef.current = true
    return cancel
  }, [])

  return [_value, cancel] as const
}
