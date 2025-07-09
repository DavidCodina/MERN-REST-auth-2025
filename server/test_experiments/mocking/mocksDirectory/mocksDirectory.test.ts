import { divide } from './'
import { divider } from './math_utils'
import { MockedFunction } from 'vitest'

///////////////////////////////////////////////////////////////////////////
//
// Vitest doesn't automatically look for or implement the __mocks__ directory like Jest does.
// You'll need to explicitly mock the module in your test file. Using the __mocks__ directory
// in Vitest allows you to simplify your mocking process by not needing to pass a second argument
// to vi.mock().
//
// Using __mocks__ to move the mocking logic out of the test file may be useful in some cases.
//
///////////////////////////////////////////////////////////////////////////

vi.mock('./math_utils')

/* ========================================================================

======================================================================== */

describe('divide', () => {
  // beforeEach(() => { vi.clearAllMocks() })

  /* ======================

  ====================== */

  // The actual divider() function divides by 10.
  // However, within ./__mocks__/math_utils.ts, we have a mock
  // that instead divides by 5. Consequently, expected is 20.
  it('should return 20.', () => {
    // Arrange
    const value = 100
    const expected = 20

    // Act
    const received = divide(value)

    // Assert
    expect(divider).toHaveBeenCalledTimes(1)
    expect(received).toBe(expected)
  })

  /* ======================

  ====================== */

  it('should return 50.', () => {
    // Arrange
    // divider is, in fact, being mocked within __mocks__, and has methods on it from MockedFunction.
    // However, Typescript is unaware of this. Consequently, we need to use vi.mocked(),
    // or do something like this before calling a mock method. We can then use
    // divider to create a one-off mock as follows:
    ;(divider as MockedFunction<typeof divider>).mockImplementationOnce(
      (n: number): number => {
        return n / 2
      }
    )
    // Arrange
    const value = 100
    const expected = 50

    // Act
    const received = divide(value)

    // Assert
    expect(divider).toHaveBeenCalledTimes(2)
    expect(received).toBe(expected)
  })
})
