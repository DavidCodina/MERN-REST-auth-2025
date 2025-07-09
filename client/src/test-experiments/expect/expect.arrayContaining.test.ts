/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: <T>(expected: T[]) => any
//
// When used with an equality check, this asymmetric matcher will return true
// if the value is an array and contains specified items. In the following example,
// toEqual is a little less specific such that we don't need to explicitly define
// every aspect skills. A similar approach has been taken for testing other properties of user.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.arrayContaining...', () => {
  test('should pass.', () => {
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
      lastName: expect.stringContaining('ina'),
      skills: expect.arrayContaining(['React']),
      age: expect.any(Number),
      address: expect.objectContaining({ street: '123 Fake Street' })
    })
  })
})
