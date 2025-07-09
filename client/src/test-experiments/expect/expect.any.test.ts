/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (constructor: unknown) => any
//
// This asymmetric matcher, when used with an equality check, will return true only
// if the value is an instance of a specified constructor. Useful, if you have a value
// that is generated each time, and you only want to know that it exists with a proper type.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.any...', () => {
  test('should pass', () => {
    const user = { email: 'david@example.com', pin: 1234 }

    expect(user).toEqual({ email: expect.any(String), pin: expect.any(Number) })
  })
})
