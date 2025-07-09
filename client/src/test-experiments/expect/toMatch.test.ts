/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: string | regexp) => Awaitable<void>
//
// toMatch asserts if a string matches a regular expression or a string.
//
///////////////////////////////////////////////////////////////////////////

describe('toMatch...', () => {
  it(`should match /^daveman$/i.`, () => {
    expect('dAvEmAn').toMatch(/^daveman$/i)
    expect('dAvEmAnX').not.toMatch(/^daveman$/i)
  })
})
