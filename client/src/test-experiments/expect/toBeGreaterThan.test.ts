/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (n: number | bigint) => Awaitable<void>
//
// toBeGreaterThan asserts if actual value is greater than received one. Equal values will fail the test.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeGreaterThan...', () => {
  it('should be greater than 3.', () => {
    expect(4).toBeGreaterThan(3)
  })
})
