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

  /* ======================

  ====================== */

  test('should invoke callback() (mock)', () => {
    // Arrange
    const mockCallback = vi.fn()

    // Act
    fireCallback(message, mockCallback)

    // Assert
    expect(mockCallback).toHaveBeenCalled()
  })

  /* ======================

  ====================== */

  // Mocking functions can be split up into two different categories; spying & mocking.
  test('should invoke callback() (spy)', () => {
    // Arrange
    const module = {
      callback: (str: string) => {
        return str
      }
    }

    const spy = vi.spyOn(module, 'callback')
    // Act
    fireCallback(message, module.callback)

    // Assert
    expect(spy.mock.results[0].value).toBe(message)
    expect(spy).toHaveBeenCalled()
  })

  /* ======================

  ====================== */

  test(`should invoke callback() with arg of: '${message}' (mock)`, () => {
    const mockCallback = vi.fn()

    fireCallback(message, mockCallback)

    expect(mockCallback).toHaveBeenCalledWith(message)
  })

  /* ======================

  ====================== */

  test(`should invoke callback() with arg of: '${message}' (spy)`, () => {
    // Arrange
    const module = {
      callback: (str: string) => {
        return str
      }
    }
    const spy = vi.spyOn(module, 'callback')

    // Act
    fireCallback(message, module.callback)

    // Assert
    expect(spy).toHaveBeenCalledWith(message)
  })

  /* ======================

  ====================== */

  test(`should invoke callback() and return: '${message}' (mock)`, () => {
    const mockCallback = vi.fn()

    // fireCallback() returns : callback?.(message), so what we're
    // testing here is that the return value is correctly returning
    // the result of the executed callback.
    mockCallback.mockReturnValue(message)

    const received = fireCallback(message, mockCallback)

    expect(received).toBe(message)
  })

  /* ======================

  ====================== */

  test(`should invoke callback() and return: '${message}' (spy)`, () => {
    // Arrange
    const module = {
      callback: (str: string) => {
        return str
      }
    }
    const spy = vi.spyOn(module, 'callback')

    spy.mockReturnValue(message)

    // Act
    const received = fireCallback(message, module.callback)

    // Assert
    // This is implicitly testing that fireCallback() passes message to the callback.
    // This gives us confidence that fireCallback() isn't returning the message for
    // some other reason other than that the callback is also returning the message.
    expect(spy).toReturnWith(message)

    expect(received).toBe(message)
  })

  /* ======================

  ====================== */

  test(`should return the correct concatenation (mock).`, () => {
    // Arrange
    const name = 'Fred'
    const expected = `${name} is a dummy!`

    const mockCallback = vi.fn().mockImplementation((name: string) => {
      return `${name} is a dummy!`
    })

    // Act
    const received = fireCallback(name, mockCallback)

    // Assert
    expect(mockCallback).toHaveBeenCalledWith(name)
    expect(received).toBe(expected)
    expect(received).not.toBe(`${name} is a genius!`)
  })

  /* ======================

  ====================== */

  test(`should return the correct concatenation (spy).`, () => {
    // Arrange
    const module = {
      callback: (str: string) => {
        return str
      }
    }
    const spy = vi.spyOn(module, 'callback')
    const name = 'Fred'
    const expected = `${name} is a dummy!`

    // This is interesting because we can actually take a spy an overwrite it's implemnation.
    // At this point, we're not reeally merely spying, by we're truly mocking the callback.
    spy.mockImplementation((name: string) => {
      return `${name} is a dummy!`
    })

    // Act
    const received = fireCallback(name, module.callback)

    // Assert
    expect(module.callback).toHaveBeenCalledWith(name)
    expect(received).toBe(expected)
    expect(received).not.toBe(`${name} is a genius!`)
  })
})
