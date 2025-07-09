import { multiply } from './'
import { multiplier } from './utils'
// import { MockedFunction } from 'vitest'

///////////////////////////////////////////////////////////////////////////
//
// Gotcha: This is a global mock, hoisted to the top of the file, so
// even if you create it within a test case, it will STILL be hoisted.
// for that reason, we should always define it at the top of the file instead.
// However, be aware that toHaveBeenCalledTimes() and other such methods will
// be cumulative, unless you clear the mocks before each test.
//
// The vi.mock() + vi.mocked() implementation below is essentally the same as
// this:
//
//   vi.mock('./utils', () => ({
//     multiplier: vi.fn((n: number): number => {
//       return n * 5
//     })
//   }))
//
// While you may see people using mocked() in this way, it's not really the ideal use
// case. Simply using the above implementation is generally a better approach. That said,
// there is a more practical use case for vi.mocked() within the second test below.
//
///////////////////////////////////////////////////////////////////////////

vi.mock('./utils')
vi.mocked(multiplier).mockImplementation((n: number): number => {
  return n * 5
})

/* ========================================================================

======================================================================== */

describe('multiply', () => {
  // beforeEach(() => { vi.clearAllMocks() })

  /* ======================

  ====================== */

  it('should return 25.', () => {
    // Arrange
    const value = 5
    const expected = 25

    // Act
    const received = multiply(value)

    // Assert
    // Because multiplier is mocked, we can now make assertions against it.
    expect(multiplier).toHaveBeenCalledTimes(1)
    expect(received).toBe(expected)
  })

  /* ======================

  ====================== */

  it('should should return 35.', () => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // vi.mocked(multiplier)... is more practical in this case. To achieve similar
    // behavior without vi.mocked(), you wouuld need to do this:
    //
    //    // ❌ Property 'mockImplementationOnce' does not exist on type '(n: number) => number'.
    //    multiplier.mockImplementationOnce((n: number): number => {
    //     return n * 7
    //   })
    //
    //   // ✅
    //   const mockedMultiplier = multiplier as MockedFunction<typeof multiplier>
    //   mockedMultiplier.mockImplementationOnce((n: number): number => {
    //     return n * 7
    //   })
    //
    // Even though multiplier IS a mocked function, Typesccript doesn't know that.
    // Consequently, in order to call mock methods directly on multiplier, we would
    // need to typecast it as a MockedFunction, which is more verbose than just
    // using vi.mocked().
    //
    ///////////////////////////////////////////////////////////////////////////

    vi.mocked(multiplier).mockImplementationOnce((n: number): number => {
      return n * 7
    })

    // Arrange
    const value = 5
    const expected = 35

    // Act
    const received = multiply(value)

    // Assert
    expect(multiplier).toHaveBeenCalledTimes(2)
    expect(received).toBe(expected)
  })

  /* ======================

  ====================== */

  it('should should return 25 (again).', () => {
    // Arrange
    const value = 5
    const expected = 25

    // Act
    const received = multiply(value)

    // Assert
    expect(multiplier).toHaveBeenCalledTimes(3)
    expect(received).toBe(expected)
  })
})
