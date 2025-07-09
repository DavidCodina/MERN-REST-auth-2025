import { getName } from './'
// import { getMyName } from '../utils'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Uncomment this, and the return value will be undefined. Why?
// Because vi.mock('../utils') will, in fact, mock EVERY function
// in the module and replace it with vi.fn(), which by default
// returns undefined.
//
//vi.mock('../utils')
//
// If you want to set it with the expected return value do this:
// vi.mock('../utils', () => ({  getMyName: vi.fn().mockReturnValue('David') }))
//
// As another intersting test of Vitest, if for some reason we did this here:
//
// vi.mock('../utils', () => ({ getExchangeRate: vi.fn().mockReturnValue(1.5) }))
//
// Then Vitest would error with:
//
//   Error: [vitest] No "getMyName" export is defined on the "../utils" mock. Did you forget to return it from "vi.mock"?
//   If you need to partially mock a module, you can use "importOriginal" helper inside:
//
// vi.mock('../utils', async (importOriginal) => {
//   const actual = await importOriginal()
//   return {
//     ...(typeof actual === 'object' ? actual : {})
//     // your mocked methods
//     // getMyName: vi.fn().mockReturnValue('Dave')
//   }
// })
//
// That's a super useful message! It also implies that using the function for
// the second argument completely replaces the module.
//
/////////////////////////
//
// Alternatively, you can do this:
//
//   import { getName } from './'
//   import { getMyName } from '../utils'
//
//   vi.mock('../utils')
//
//   describe('getName()...', () => {
//     it(`should return 'David'.`, () => {
//       vi.mocked(getMyName).mockReturnValue('David')
//       const result = getName()
//       expect(result).toBe('David')
//     })
//
//     it(`should return 'Holly'.`, () => {
//       // The result Will still be 'David' unless we change vi.mocked().
//       // vi.mocked() modifies the vi.mock(). Thus, vi.mocked is NOT an
//       // encapsulated change, and it WILL affect the hoisted version of the mock.
//
//       vi.mocked(getMyName).mockReturnValue('Holly')
//       const result = getName()
//       expect(result).toBe('Holly')
//     })
//   })
//
///////////////////////////////////////////////////////////////////////////

describe('getName()...', () => {
  it(`should return 'David'.`, () => {
    const result = getName()
    expect(result).toBe('David')
  })
})
