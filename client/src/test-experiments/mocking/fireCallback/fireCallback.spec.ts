import { fireCallback } from './index'

///////////////////////////////////////////////////////////////////////////
//
// This file demonstrates how to use mock functions. A mock function
// ( i.e., vi.fn() ) is useful for testing things like:
//
//  - if a function has been called
//  - what arguments that function has been called with.
//
// In this case, we're just testing a function called fireCallback(), which
// is obviously super contrived. However, suppose that we have a component
// that takes in an onClick function as a prop. Then we await user.click()
// on some button in the component. Then we want to make sure that the actual
// function that got passed as a prop executed, what arguments it executed with
// etc.
//
// On the face of it, this seems like it would be kind of complicated because
// it's testing some deep internal implementation. However, this kind of thing
// is actually not that difficult at all.
//
// https://vitest.dev/guide/mocking.html#functions
// https://jestjs.io/docs/mock-functions
//
///////////////////////////////////////////////////////////////////////////

describe('fireCallback()...', () => {
  const message = 'abc123'

  test('should invoke callback()', () => {
    const mockCallback = vi.fn()

    fireCallback(message, mockCallback)
    expect(mockCallback).toHaveBeenCalled()
  })

  test(`should invoke callback() with arg of: '${message}'`, () => {
    const mockCallback = vi.fn()
    fireCallback(message, mockCallback)
    expect(mockCallback).toHaveBeenCalledWith(message)
  })

  test(`should invoke callback() and return: '${message}'`, () => {
    const mockCallback = vi.fn()

    // fireCallback() returns : callback?.(message), so what we're
    // testing here is that the return value is correctly returning
    // the result of the executed callback.
    // One could also just do this:
    // const mockCallback = vi.fn((value) => value)
    mockCallback.mockReturnValue(message)
    const result = fireCallback(message, mockCallback)

    expect(result).toBe(message)
  })

  test(`should return the correct concatenation.`, () => {
    const name = 'Fred'
    const expected = `${name} is a dummy!`

    const mockCallback = vi.fn().mockImplementation((name: string) => {
      return `${name} is a dummy!`
    })

    const result = fireCallback(name, mockCallback)

    expect(mockCallback).toHaveBeenCalledWith(name)
    expect(result).toBe(expected)
    expect(result).not.toBe(`${name} is a genius!`)
  })
})
