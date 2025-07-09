/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// toBe can be used to assert if primitives are equal or that objects share the same
// reference. It is equivalent of calling expect(Object.is(3, 3)).toBe(true).
// If the objects are not the same, but you want to check if their structures are identical,
// you can use toEqual.
//
///////////////////////////////////////////////////////////////////////////

describe('toBe...', () => {
  it('should be tautologous.', () => {
    expect(true).toBe(true)
  })

  // Try not to use toBe with floating-point numbers. Since JavaScript
  // rounds them, 0.1 + 0.2 is not strictly 0.3.
  // To reliably assert floating-point numbers, use toBeCloseTo assertion.
  test.fails('decimals are not equal in javascript', () => {
    expect(0.2 + 0.1).toBe(0.3) // 0.2 + 0.1 is 0.30000000000000004
  })
})
