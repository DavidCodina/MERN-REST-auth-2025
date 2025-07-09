/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => any
//
// This asymmetric matcher, when used with equality check, will always return true.
// Useful, if you just want to be sure that the property exist.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.anything...', () => {
  test('should pass', () => {
    const user = { email: 'david@example.com', pin: 1234 }

    expect(user).toEqual({ email: expect.any(String), pin: expect.anything() })
  })
})
