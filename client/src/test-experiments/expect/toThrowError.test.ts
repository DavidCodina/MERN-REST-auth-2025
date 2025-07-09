const returnString = (value: string): string => {
  if (typeof value !== 'string') {
    throw new Error('The value must be a string.')
  }
  return value
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type:  (received: any) => Awaitable<void>
// Alias: toThrow
//
// Note: In Jest toThrow is an alias for toThrowError. That also seems to be how it works in Vitest.
//
// toThrowError asserts if a function throws an error when it is called. You can provide an optional
// argument to test that a specific error is thrown:
//
//   - RegExp: error message matches the pattern
//   - string: error message includes the substring
//   - Error, AsymmetricMatcher: compare with a received object similar to toEqual(received)
//
///////////////////////////////////////////////////////////////////////////

describe('toTrhowError...', () => {
  it('should throw an error when the value is not a string.', () => {
    const value = 123

    // You must wrap the code in a function, otherwise the error will not be caught, and test will fail.
    const resultFn = () => {
      return returnString(value as unknown as string)
    }

    expect(resultFn).toThrowError()
    expect(resultFn).toThrow() // Alias
  })

  it("should throw an error with a message of: 'The value must be a string.'", () => {
    const value = 123
    const message = new Error('The value must be a string.')
    const resultFn = () => {
      return returnString(value as unknown as string)
    }

    expect(resultFn).toThrow(message)
  })

  // Constructable example
  it('should throw an error of Error.', () => {
    const value = 123
    const resultFn = () => {
      return returnString(value as unknown as string)
    }

    expect(resultFn).toThrow(Error)
  })

  // Constructable example
  it('should NOT throw an error of TypeError.', () => {
    const value = 123
    const resultFn = () => {
      return returnString(value as unknown as string)
    }

    expect(resultFn).not.toThrow(TypeError)
  })
})
