const add = (n1: number, n2: number) => {
  return n1 + n2
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (time: number, returnValue: any) => Awaitable<void>
//
// You can call this assertion to check if a function has successfully returned
// a value with certain parameters on a certain call. Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveNthReturnedWith...', () => {
  it(`should have nth returned with 14.`, () => {
    const addSpy = vi.fn(add)

    addSpy(1, 2)
    addSpy(5, 9)
    addSpy(3, 5)

    expect(addSpy).toHaveNthReturnedWith(2, 14)
  })
})
