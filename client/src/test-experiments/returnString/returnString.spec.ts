import { returnString } from './index'

describe('The returnString() function...', () => {
  it('should return the same string value as was passed to it.', () => {
    // Arrange
    const value = 'Testing 123...'
    const expected = value

    // Act
    const result = returnString(value)

    // Assert
    expect(result).toBe(expected)
  })

  it('should NOT throw an error when the value IS a string.', () => {
    const value = '123'

    const resultFn = () => {
      return returnString(value as unknown as string)
    }

    expect(resultFn).not.toThrow()
  })

  it('should throw an error when the value is NOT a string.', () => {
    const value = 123

    const resultFn = () => {
      return returnString(value as unknown as string)
    }

    expect(resultFn).toThrow()
  })

  it("should throw an error with a message of: 'The value must be a string.'", () => {
    const value = 123
    // const message = 'The value must be a string.'
    // const message = /must be a string/i
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
