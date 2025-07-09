import * as utils from './utils'

///////////////////////////////////////////////////////////////////////////
//
// Doing this alone will mock the entire module:
//
//   vi.mock('./utils')
//
// But what if only want to mock the subtract() function?
// We can use partial mocking:  https://vitest.dev/guide/mocking#mock-part-of-a-module
//
///////////////////////////////////////////////////////////////////////////

vi.mock('./utils', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('./utils')>()

  return {
    ...originalModule,
    subtract: vi.fn()
  }
})

describe('utils...', () => {
  /* ======================

  ====================== */

  test('add() should return 3.', () => {
    // Arrange
    const expected = 3

    // Act
    const received = utils.add(1, 2)

    // Assert
    expect(received).toBe(expected)
  })

  /* ======================

  ====================== */
  // Normally, subtract(3,2) would return 1, but since it's still being mocked, it returns undefined.
  // However, we can set the return value explicitly in the partial mock above, or we can do it here.

  test('subtract() should return 1.', () => {
    // Arrange
    const mocked = vi
      .mocked(utils.subtract)
      .mockImplementationOnce((n1: number, n2: number): number => {
        return n1 - n2
      })

    const expected = 1

    // Act
    const received = utils.subtract(3, 2)
    const args = mocked.mock.calls[0]

    // Assert
    expect(args[0]).toBe(3)
    expect(args[1]).toBe(2)
    expect(received).toBe(expected)
  })
})
