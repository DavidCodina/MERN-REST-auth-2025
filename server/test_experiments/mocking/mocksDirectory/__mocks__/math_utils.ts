///////////////////////////////////////////////////////////////////////////
//
// We could do this:
//
//   export const divider = (n: number): number => {
//     return n / 5
//   }
//
// However, the mock implementation in the __mocks__ directory does not automatically create
// mocked functions with tracking capabilities like vi.fn(). Thus,
// this won't work from with a test:
//
//  ❌ expect(divider).toHaveBeenCalledTimes(1)
//
// In order to also have tracking capabilities, we need to do the following:
//
///////////////////////////////////////////////////////////////////////////

export const divider = vi.fn((n: number): number => {
  return n / 5
})
