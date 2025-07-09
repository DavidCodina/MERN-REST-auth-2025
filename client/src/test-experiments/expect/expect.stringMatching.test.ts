/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (expected: any) => any
//
// When used with an equality check, this asymmetric matcher will return true if the value
// is a string and contains a specified substring or if the string matches a regular expression.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.stringMatching...', () => {
  test('should pass', () => {
    const user = {
      firstName: 'David',
      lastName: 'Codina',
      skills: ['React', 'Typescript', 'Node'],
      age: 46,
      address: {
        street: '123 Fake Street',
        city: 'Bellevue',
        state: 'WA',
        zip: '98004'
      }
    }

    expect(user).toEqual({
      firstName: expect.stringMatching(/id/i), // 👈🏻
      lastName: expect.stringContaining('ina'),
      skills: expect.arrayContaining(['React']),
      age: expect.any(Number),
      address: expect.objectContaining({ street: '123 Fake Street' })
    })
  })
})
