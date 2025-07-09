const isOne = (value: any) => {
  if (value !== 1) {
    return false
  }
  return true
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (message?: string) => never
//
// The expect.unreachable() function is used in test cases where you have some code
// that should never be executed. If that code does get executed, it means there's
// a problem and the test should fail.
//
// Probably the most confusing part about this method is knowing when to use it.
// expect.unreachable() can be particularly useful in switch-case structures where
// you've handled all possible cases and want to make sure that no unhandled cases exist.
// If an unhandled case comes up, it would hit the expect.unreachable() and the test would
// fail, alerting you to the issue.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.unreachable...', () => {
  test('unreachable.', () => {
    const value = 1
    const result = isOne(value)

    if (result === true) {
      expect(true).toBe(true)
    } else {
      expect.unreachable('The value is not 1.')
    }
  })
})
