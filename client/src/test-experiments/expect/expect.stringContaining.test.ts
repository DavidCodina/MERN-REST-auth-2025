/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (expected: any) => any
//
// When used with an equality check, this asymmetric matcher will return true
// if the value is a string and contains a specified substring.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.stringContaining...', () => {
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
      firstName: 'David',
      lastName: expect.stringContaining('ina'), // 👈🏻
      skills: expect.arrayContaining(['React']),
      age: expect.any(Number),
      address: expect.objectContaining({ street: '123 Fake Street' })
    })
  })
})
