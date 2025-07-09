/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (expected: any, precision?: number) => any
//
// expect.closeTo is useful when comparing floating point numbers in object properties
// or array item. If you need to compare a number, please use .toBeCloseTo instead.
//
// The optional numDigits argument limits the number of digits to check after the decimal point.
// For the default value 2, the test criterion is Math.abs(expected - received) < 0.005 (that is, 10 ** -2 / 2).
// For example, this test passes with a precision of 5 digits:
//
///////////////////////////////////////////////////////////////////////////

describe('expect.closeTo...', () => {
  test('compare float in object properties', () => {
    const received = { title: '0.1 + 0.2', sum: 0.1 + 0.2 }
    const expected = { title: '0.1 + 0.2', sum: expect.closeTo(0.3, 5) }

    expect(received).toEqual(expected)
  })
})
