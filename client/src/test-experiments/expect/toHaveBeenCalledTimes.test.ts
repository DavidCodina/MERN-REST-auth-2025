const utils = {
  add: (n1: number, n2: number) => {
    return n1 + n2
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (amount: number) => Awaitable<void>
//
// This assertion checks if a function was called a certain amount of times. Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveBeenCalledTimes...', () => {
  it(`should have been called 3 times.`, () => {
    const addSpy = vi.spyOn(utils, 'add')

    expect(addSpy).not.toHaveBeenCalled()

    utils.add(1, 1)
    utils.add(2, 2)
    utils.add(3, 3)

    expect(addSpy).toHaveBeenCalled()
    expect(addSpy).toHaveBeenCalledTimes(3)
  })
})
