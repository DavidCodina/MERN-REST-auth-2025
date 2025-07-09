function returnNull() {
  return null
}

function empty() {}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// toBeDefined asserts that the value is not equal to undefined.
// Useful use case would be to check if function returned anything.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeDefined...', () => {
  test('returnNull() should be defined.', () => {
    expect(returnNull()).toBeDefined()
  })

  test.fails('empty() should fail - be undefined.', () => {
    expect(empty()).toBeDefined()
  })
})
