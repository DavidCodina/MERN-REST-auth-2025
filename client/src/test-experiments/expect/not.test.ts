/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Using not will negate the assertion. For example, this code asserts that
// an input value is not equal to 2. If it's equal, the assertion will throw
// an error, and the test will fail.
//
///////////////////////////////////////////////////////////////////////////

describe('not...', () => {
  it(`should not be 2.`, () => {
    expect(3).not.toBe(2)
  })
})
