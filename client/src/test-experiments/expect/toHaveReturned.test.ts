const add = (n1: number, n2: number) => {
  return n1 + n2
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => Awaitable<void>
//
// This assertion checks if a function has successfully returned a value at least once (i.e., did not throw an error).
// Requires a spy function to be passed to expect.
//
// This example is interesting to me because it shows that you can pass the actual add() to vi.fn().
// Then you can call the addSpy(), which is internally calling the actual add(). Then we can make
// assertions against addSpy().
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveReturned...', () => {
  it(`should have returned after being called.`, () => {
    const addSpy = vi.fn(add)

    expect(addSpy).not.toHaveReturned()

    const result = addSpy(1, 2)

    expect(result).toBe(3)
    expect(addSpy).toHaveReturned()
  })
})
