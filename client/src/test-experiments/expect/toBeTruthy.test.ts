/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// toBeTruthy asserts that the value is true when converted to boolean.
// Useful if you don't care for the value, but just want to know it can be converted to true.
//
// For example, having this code you don't care for the return value of stocks.getInfo
// - it maybe a complex object, a string, or anything else. The code will still work.
//
// Everything in JavaScript is truthy, except false, null, undefined, NaN, 0, -0, 0n, "" and document.all.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeTruthy...', () => {
  test('values should be truthy.', () => {
    expect(true).toBeTruthy()
    expect([]).toBeTruthy()
    expect({}).toBeTruthy()
    expect(-1).toBeTruthy()
    expect('0').toBeTruthy()
  })
})
