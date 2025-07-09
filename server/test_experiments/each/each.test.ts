import { isEven } from './index'
// https://vitest.dev/api/#test-each

describe('isEven()...', () => {
  /* ======================

  ====================== */

  it.each([
    { a: 2, expected: true },
    { a: 3, expected: false },
    { a: 4, expected: true },
    { a: 5, expected: false },
    { a: 0, expected: true },
    { a: -2, expected: true },
    { a: -3, expected: false }
  ])('should return $expected for $a', ({ a, expected }) => {
    const received = isEven(a)
    expect(received).toBe(expected)
  })
})
