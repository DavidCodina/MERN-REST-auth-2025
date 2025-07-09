/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (n: number | bigint) => Awaitable<void>
//
// toBeLessThanOrEqual asserts if actual value is less than received one or equal to it.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeLessThanOrEqual...', () => {
  it('should be less than or equal to 3.', () => {
    expect(3).toBeLessThanOrEqual(3)
  })
})
