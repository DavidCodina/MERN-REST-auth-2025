function empty() {}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// Opposite of toBeDefined, toBeUndefined asserts that the value is equal
// to undefined. Useful use case would be to check if function hasn't returned anything.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeUndefined...', () => {
  test('empty() should return undefined.', () => {
    expect(empty()).toBeUndefined()
  })
})
