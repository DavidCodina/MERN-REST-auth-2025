/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// toBeNaN simply asserts if something is NaN. Alias for .toBe(NaN).
//
///////////////////////////////////////////////////////////////////////////

describe('toBeNaN...', () => {
  // Here I'm highlighting the fact that parseFloat() is stupid
  // and can't parse a value with '$'
  it('should be NaN.', () => {
    expect(parseFloat('$100')).toBeNaN()
  })

  it('unndefined + 1 should be NaN.', () => {
    let value: any = undefined
    value += 1

    expect(value).toBeNaN()
  })
})
