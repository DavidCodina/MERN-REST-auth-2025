/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// toBeFalsy asserts that the value is false when converted to boolean.
// Useful if you don't care for the value, but just want to know if it can be converted to false.
//
// Everything in JavaScript is truthy, except false, null, undefined, NaN, 0, -0, 0n, "" and document.all.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeFalsy...', () => {
  test('values should be falsy.', () => {
    expect(false).toBeFalsy()
    expect(null).toBeFalsy()
    expect(undefined).toBeFalsy()
    expect(NaN).toBeFalsy()
    expect(0).toBeFalsy()
    expect(-0).toBeFalsy()
  })
})
