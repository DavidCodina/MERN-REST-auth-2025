/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>
//
// toBeTypeOf asserts if an actual value is of type of received type.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeTypeOf...', () => {
  it("should be type of 'string'.", () => {
    const received = 'Whuddup!'
    const expected = 'string'

    expect(received).toBeTypeOf(expected)
    expect(received).not.toBeTypeOf('number')
  })
})
