const utils = {
  add: (n1: number, n2: number) => {
    return n1 + n2
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (...args: any[]) => Awaitable<void>
//
// This assertion checks if a function was called with certain parameters at its last invocation.
// Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveBeenLastCalledWith...', () => {
  it(`should have been last called with 2,3.`, () => {
    const addSpy = vi.spyOn(utils, 'add')
    utils.add(1, 2)
    utils.add(2, 3)

    expect(addSpy).toHaveBeenLastCalledWith(2, 3)
  })
})
