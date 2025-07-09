/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (sample: Array<any>) => any
//
// toBeOneOf asserts if a value matches any of the values in the provided array.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeOneOf...', () => {
  const fruit = 'apple'
  test('fruit is one of the allowed values', () => {
    expect(fruit).toBeOneOf(['apple', 'banana', 'orange'])
  })

  test('fruit is one of the allowed values', () => {
    expect(undefined).toBeOneOf(['abc123', undefined])
  })

  // The asymmetric matcher is particularly useful when testing optional
  // properties that could be either null or undefined:
  test('optional properties can be null or undefined', () => {
    const user = {
      firstName: 'John',
      middleName: undefined,
      lastName: 'Doe'
    }

    // Nope! Despite the docs providing this example, it doesn't work:
    // AssertionError: expected { firstName: 'John', …(2) } to deeply equal { firstName: Any<String>, …(2) }
    //
    //   expect(user).toEqual({
    //     firstName: expect.any(String),
    //     middleName: expect.toBeOneOf([expect.any(String), undefined]),
    //     lastName: expect.any(String)
    //   })

    expect(user.firstName).toBeTypeOf('string')
    expect(user.middleName).toBeOneOf([expect.any(String), undefined])
    expect(user.lastName).toBeTypeOf('string')
  })
})
