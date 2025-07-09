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
// a value with certain parameters at least once. Requires a spy function to be passed to expect.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveReturnedWith...', () => {
  it(`should have returned with 3.`, () => {
    const addSpy = vi.fn(add)

    addSpy(1, 2)

    expect(addSpy).toHaveReturnedWith(3)
  })

  // To be fair, if this is all you're using the mock for, then it's just easier to do this:
  it(`should have returned with 3.`, () => {
    const result = add(1, 2)
    const expected = 3

    expect(result).toBe(expected)
  })
})
