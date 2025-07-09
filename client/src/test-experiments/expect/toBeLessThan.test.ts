/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (n: number | bigint) => Awaitable<void>
//
// toBeLessThan asserts if actual value is less than received one. Equal values will fail the test.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeLessThan...', () => {
  it('should be less than 3.', () => {
    expect(2).toBeLessThan(3)
  })
})
