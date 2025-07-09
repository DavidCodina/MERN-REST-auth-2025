/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: number) => Awaitable<void>
//
// toHaveLength asserts if an object has a .lengthproperty and it is set to a certain numeric value.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveLength...', () => {
  it(`should have a length of 3.`, () => {
    expect('abc').toHaveLength(3)
    expect([1, 2, 3]).toHaveLength(3)
    expect('').not.toHaveLength(3) // doesn't have .length of 3
    expect({ length: 3 }).toHaveLength(3)
  })
})
