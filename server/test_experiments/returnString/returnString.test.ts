import { returnString } from './index'

describe('returnString()...', () => {
  /* ======================

  ====================== */

  it('should return the same string value as was passed to it.', () => {
    // Arrange
    const value = 'Testing 123...'
    const expected = value

    // Act
    const received = returnString(value)

    // Assert
    expect(received).toBe(expected)
  })

  /* ======================

  ====================== */

  it('should NOT throw an error when the value IS a string.', () => {
    // Arrange
    const value = '123'

    // Act
    const resultFn = () => {
      return returnString(value)
    }

    // Assert
    expect(resultFn).not.toThrow()
  })

  /* ======================

  ====================== */

  it('should throw an error when the value is NOT a string.', () => {
    // Arrange
    const value: any = 123

    // Act
    const resultFn = () => {
      return returnString(value)
    }

    // Assert
    expect(resultFn).toThrow()
  })

  /* ======================

  ====================== */

  it("should throw an error with a message of: 'The value must be a string.'", () => {
    // Arrange
    const value: any = 123
    // const message = 'The value must be a string.'
    // const message = /must be a string/i
    const message = new Error('The value must be a string.')

    // Act
    const resultFn = () => {
      return returnString(value)
    }

    // Assert
    expect(resultFn).toThrow(message)
  })

  /* ======================

  ====================== */
  // Constructable example

  it('should throw an error of Error.', () => {
    // Arrange
    const value: any = 123

    // Act
    const resultFn = () => {
      return returnString(value)
    }

    // Assert
    expect(resultFn).toThrow(Error)
  })

  /* ======================

  ====================== */
  // Constructable example

  it('should NOT throw an error of TypeError.', () => {
    // Arrange
    const value: any = 123

    // Act
    const resultFn = () => {
      return returnString(value)
    }

    // Assert
    expect(resultFn).not.toThrow(TypeError)
  })
})
