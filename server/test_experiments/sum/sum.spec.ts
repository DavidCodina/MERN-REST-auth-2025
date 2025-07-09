import { sum } from './index'

///////////////////////////////////////////////////////////////////////////
//
// Gotcha: https://vitest.dev/guide/common-errors#cannot-find-module-relative-path
// You can't actually use relative path aliases in the test files.
// However, if the file your testing uses relative path aliases, then that
// will still work. For example, I did this and it still worked:
//
//   import { log } from 'utils/log'
//   import { add } from 'utils/add'
//
//   export const sum = (...numbers: number[]): number => {
//     log()
//     return add(...numbers)
//   }
//
///////////////////////////////////////////////////////////////////////////

import { describe, it, expect, test } from 'vitest'

describe('sum()...', () => {
  test('should return 0 with no numbers', () => {
    // Arrange
    const value = 0
    const expected = value

    // Act
    const received = sum()

    // Assert
    expect(received).toBe(expected)
  })

  /* ======================

  ====================== */

  it('should return same number when only one arg is provided.', () => {
    // Arrange
    const value = 5
    const expected = value

    // Act
    const received = sum(value)

    // Assert
    expect(received).toBe(expected)
  })

  /* ======================
  
  ====================== */

  it("should return a value that is typeof 'number' and NOT NaN.", () => {
    // Arrange
    const values = [1, 2, 3]

    // Act
    const received = sum(...values)

    // Assert
    // Gotcha: NaN is typeof number: console.log(typeof NaN) => 'number',
    // so this might not be the best approach.
    expect(received).toBeTypeOf('number')

    // Thus we can add this as well.
    expect(received).not.toBeNaN()
  })

  /* ======================
  
  ====================== */

  it("should return a value that IS typeof 'number' and NaN.", () => {
    // Arrange
    const values: any = [1, undefined]

    // Act
    const received = sum(...values)

    // Assert
    expect(received).toBeTypeOf('number')
    expect(received).toBeNaN()
  })

  /* ======================
  
  ====================== */

  test('should return correct sum with multiple args.', () => {
    // Arrange
    const values = [1, 2, 3]
    const expected = 6

    // Act
    const received = sum(...values)

    // Assert
    expect(received).toBe(expected)
  })

  /* ======================
  
  ====================== */
  // Use toBeCloseTo to compare floating-point numbers.
  // https://www.youtube.com/watch?v=qTXwRSksJPg

  test('should NOT return 0.3.', () => {
    // Arrange
    const value = 0.3
    const expected = value

    // Act
    const received = sum(0.1, 0.2) // => 0.30000000000000004

    // Assert
    expect(received).not.toBe(expected)
  })
})
