const add = (n1: number, n2: number) => {
  return n1 + n2
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (amount: number) => Awaitable<void>
//
// This assertion checks if a function has successfully returned a value exact amount of times
// (i.e., did not throw an error). Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveReturnedTimes...', () => {
  it(`should have returned twice.`, () => {
    const addSpy = vi.fn(add)

    expect(addSpy).not.toHaveReturned()

    addSpy(1, 2)
    addSpy(2, 3)

    expect(addSpy).toHaveReturnedTimes(2)
  })
})
