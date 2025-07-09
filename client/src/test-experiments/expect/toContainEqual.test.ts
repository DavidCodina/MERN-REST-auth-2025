/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: any) => Awaitable<void>
//
// toContainEqual asserts if an item with a specific structure and values is contained in an array.
// It works like toEqual inside for each element.
//
///////////////////////////////////////////////////////////////////////////

describe('toContainEqual...', () => {
  it(`should contain { name: "Muffy" }.`, () => {
    const received = [
      { name: 'Muffy' },
      { name: 'Gingerbread' },
      { name: 'Punkin' }
    ]
    const expected = { name: 'Muffy' }

    expect(received).toContainEqual(expected)
    expect(received).not.toContain(expected)
  })
})
