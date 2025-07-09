import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

/* ========================================================================
       
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://testing-library.com/docs/react-testing-library/api/#renderhook
// Codevolution: https://www.youtube.com/watch?v=Ru4V8yCR6jQ&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=40
//
// A React hook test won't interact with any DOM elements.
// In other words, we don't assert it using the screen method.
// Instead, renderHook will wrap the hook in a function component,
// invokes the hook and returns an object from which we can
// destructure a result property.
//
///////////////////////////////////////////////////////////////////////////

describe('useCounter()', () => {
  /* ======================

  ====================== */

  test('should render the defualt initial count.', () => {
    const { result } = renderHook(() => useCounter())
    expect(result?.current?.count).toBe(0)
  })

  /* ======================

  ====================== */

  test('should render the provided initial count.', () => {
    // Normally, I would just do this:
    // const { result } = renderHook(() => useCounter(0))
    // However, renderHook() also allows you to set props in the configuration that
    // then get passed to the wrapper function, and can forwarded to the hook.

    const { result } = renderHook((props) => useCounter(props.initialCount), {
      initialProps: { initialCount: 10 }
    })

    expect(result?.current?.count).toBe(10)
  })

  /* ======================

  ====================== */

  test('should render the correct incremented count.', () => {
    const { result /* rerender , unmount */ } = renderHook(() => useCounter())

    // Act Utility: https://www.youtube.com/watch?v=W7CbUiO3_28&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=41
    // When testing hooks, especially when they involve state updates, you should
    // always wrap the state-changing actions inside act(). This is crucial for
    // ensuring that all updates are processed before you make assertions.
    act(() => {
      result?.current?.increment()
      result?.current?.increment()
      result?.current?.increment()
    })

    // The rerender() function is used to re-invoke the hook with the latest props or to ensure that
    // the component reflects the latest state after updates. In the context of your test, if you
    // were to change the initial state or props of the hook, you would use rerender() to apply those changes.
    // However, if you're only incrementing the count and not changing any props, calling rerender() may not be necessary.
    // rerender()

    expect(result?.current?.count).toBe(3)
  })

  /* ======================

  ====================== */

  test('should render the correct decremented count.', () => {
    const { result /* , rerender */ } = renderHook(() => useCounter())

    act(() => {
      result?.current?.decrement()
      result?.current?.decrement()
      result?.current?.decrement()
    })

    // rerender()

    expect(result?.current?.count).toBe(-3)
  })

  /* ======================

  ====================== */

  test('should render the value of 0 after reset().', () => {
    const { result /* , rerender */ } = renderHook(() => useCounter())

    act(() => {
      result?.current?.increment()
      result?.current?.increment()
      result?.current?.increment()
    })
    // rerender()

    expect(result?.current?.count).toBe(3)

    act(() => {
      result?.current?.reset()
    })

    // rerender()

    expect(result?.current?.count).toBe(0)
  })
})
