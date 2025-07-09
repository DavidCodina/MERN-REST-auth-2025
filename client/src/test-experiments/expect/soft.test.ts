/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// expect.soft functions similarly to expect, but instead of terminating the test execution
// upon a failed assertion, it continues running and marks the failure as a test failure.
// All errors encountered during the test will be displayed until the test is completed.
//
// So with .soft() the error will be on expect.soft(1 + 2).toBe(4), even though expect.soft(1 + 1).toBe(3)
// also failed. In practice, I can't think of a valid use case for this.
//
///////////////////////////////////////////////////////////////////////////

describe('soft...', () => {
  test('expect.soft test', () => {
    // expect.soft(1 + 1).toBe(3) // mark the test as fail and continue
    // expect.soft(1 + 2).toBe(4) // mark the test as fail and continue
    expect(true).toBe(true) // mark the test as pass and continue
  })
})
