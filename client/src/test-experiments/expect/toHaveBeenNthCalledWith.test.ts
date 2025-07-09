const utils = {
  add: (n1: number, n2: number) => {
    return n1 + n2
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (time: number, ...args: any[]) => Awaitable<void>
//
// This assertion checks if a function was called with certain parameters at the certain time.
// The count starts at 1. So, to check the second entry, you would write .toHaveBeenNthCalledWith(2, ...).
// Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveBeenNthCalledWith...', () => {
  it(`should have been last called with 5,6 on the second execution.`, () => {
    const addSpy = vi.spyOn(utils, 'add')
    utils.add(1, 2)
    utils.add(5, 6)

    expect(addSpy).toHaveBeenNthCalledWith(2, 5, 6)
  })
})
