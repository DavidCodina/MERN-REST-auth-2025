const add = (n1: number, n2: number) => {
  return n1 + n2
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (returnValue: any) => Awaitable<void>
//
// You can call this assertion to check if a function has successfully returned
// a value with certain parameters on its last invoking. Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveLastReturnedWith...', () => {
  it(`should have last returned with 14.`, () => {
    const addSpy = vi.fn(add)

    addSpy(1, 2)
    addSpy(5, 9)

    expect(addSpy).toHaveLastReturnedWith(14)
  })
})
