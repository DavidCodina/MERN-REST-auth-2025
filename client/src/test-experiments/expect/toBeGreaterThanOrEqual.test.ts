/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (n: number | bigint) => Awaitable<void>
//
// toBeGreaterThanOrEqual asserts if actual value is greater than received one or equal to it.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeGreaterThanOrEqual...', () => {
  it('should be greater than or equal to 3.', () => {
    expect(3).toBeGreaterThanOrEqual(3)
  })
})
