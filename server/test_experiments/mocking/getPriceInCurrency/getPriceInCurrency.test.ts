import { getPriceInCurrency } from './'
import * as utils from '../utils'
// import { getExchangeRate } from '../utils'

// Gotcha: This is a global mock, hoisted to the top of the file, so
// even if you create it within a test case, it will STILL be hoisted.
// for that reason, we should always define it at the top of the file instead.
// However, be aware that toHaveBeenCalledTimes() and other such methods will
// be cumulative, unless you clear the mocks before each test.
vi.mock('../utils', () => ({
  getExchangeRate: vi.fn().mockReturnValue(1.5)
}))

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Module Mocking:
//
// In this example, we are mocking getExchangeRate(), which is used internally
// within getPriceInCurrency()
//
// getPriceInCurrency() is more or less a dummy function used for this example.
// Internally, it calls getExchangeRate() which just returns Math.random().
// The return value of getPriceInCurrency() is the product of price * rate,
// where rate is also a random number (by extension).
//
// The goal is to make an assertion against getPriceInCurrency(). However, we can't
// actually know in advance what the return value will be because getExchangeRate()
// returns a random number.
//
// In order to control this, and isolate only the logic for getPriceInCurrency(), we
// can mock utils.ts module. Note: this is a strong argument in favor of
// creating utility functions with a single responsibility and modularizing them into
// a separate file.
//
// Since we've mocked getExchangeRate() such that the return value will always be 1.5,
// we can confidently assert that the expected value here will be 15.
//
/////////////////////////
//
// There are many different approaches to module mocking. By doing this:
//
//   vi.mock('../utils') // Hoisted to top of file in Vitest, but not necessarily in Jest.
//
// Then for the test we can do this:
//
//   import { getExchangeRate } from '../utils'
//
//   ...
//
//   it('should return price in target currency.', () => {
//
//     //^ This is hoisted! See here: https://vitest.dev/api/vi.html#vi-mock
//     //^ "The call to vi.mock is hoisted, so it doesn't matter where you call it."
//     //^ This seems to also apply to vi.mocked(), which is used to change a vi.mock().
//     vi.mocked(getExchangeRate).mockReturnValue(1.5)
//     const price = getPriceInCurrency(10, 'AUD')
//     expect(price).toBe(15)
//   })
//
// Note: even though we defined vi.mocked inside the test case, it's
// actually global, so if you don't change it elsewhere it will remain mocked.
// For this reason, it's probably better to set the value at the top:
//
//   vi.mock('../utils')
//   vi.mocked(getExchangeRate).mockReturnValue(1.5)
//
// Also if you didn't want to apply it globally to every test in the file, you can do this:
//
//  beforeEach(() => {  vi.resetAllMocks() })
//
// One can also overwrite the initial vi.mocked in a specific test, but this
// too would become the new hoisted value. It's quite unintuitive!
// I prefer to just use beforeEach(() => {  vi.resetAllMocks() })
//
// According to Mosh, "Vitest will replace EVERY exported function in this module with a mock function."
// He says this in video 37 at 2:30. In other words, every function WILL get replaced with vi.fn().
// This is demonstrated in getName.test.ts.
//
/////////////////////////
//
// But what if we don't want to mock every function in the module? Solution, you can do this instead:
//
//   import * as utils from '../utils'
//
//   it('should return price in target currency.', () => {
//     vi.mock('../utils', async () => {
//       const originalModule = await vi.importActual<typeof utils>('../utils')
//       return {
//         ...originalModule,
//         getExchangeRate: vi.fn().mockReturnValue(1.5)
//       }
//     })
//     const price = getPriceInCurrency(10, 'AUD')
//     expect(price).toBe(15)
//   })
//
// Or just do this, without vi.importActual
//
//   vi.mock('../utils', async (importOriginal) => {
//     const originalModule: any = await importOriginal()
//     return {
//       ...originalModule,
//       getExchangeRate: vi.fn().mockReturnValue(1.5)
//     }
//   })
//
//
// Again, in video 41 on partial mocking Mosh says that if we don't provide the function
// as the second argument and spread ...originalModule then Vitest
// will replace EVERY function in that module with vi.fn().
//
///////////////////////////////////////////////////////////////////////////

describe('getPriceInCurrency()...', () => {
  beforeEach(() => {
    // In the above comments I mentioned using vi.resetAllMocks().
    // However, here we actually want to use clearAllMocks().
    // The difference between clearing and resetting is also a gotcha!
    vi.clearAllMocks()
  })

  it('should return price in target currency.', () => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // You could also spy on the the specific function as described here:
    // https://www.chakshunyu.com/blog/how-to-mock-only-one-function-from-a-module-in-jest/
    //
    //  vi.spyOn(utils, 'getExchangeRate').mockReturnValue(1.5)
    //
    // Pros:
    //   - It's a more concise and straightforward way to mock a single function.
    //
    //   - It doesn't require creating a separate mock module.
    //
    // Cons:
    //   - It modifies the original module directly, which can lead to unintended side effects
    //     if not used carefully.
    //
    //   - It might not work as expected if the module is imported in multiple places or if the
    //     function being mocked is reassigned later in the code.
    //
    ///////////////////////////////////////////////////////////////////////////

    const price = getPriceInCurrency(10, 'AUD')
    expect(price).toBe(15)
    expect(utils.getExchangeRate).toHaveBeenCalledTimes(1)
  })

  it(`should return a price that is of type 'number'.`, () => {
    const price = getPriceInCurrency(10, 'AUD')
    expect(price).toBeTypeOf('number')
    expect(price).not.toBeNaN()
    expect(utils.getExchangeRate).toHaveBeenCalledTimes(1)
  })

  // You can do this. However, in principle it is veering away
  // from specifically unit testing getPriceInCurrency().

  it(`should call getExchangeRate() once.`, () => {
    // In this case, we don't want to replace getExchangeRate() with a mock,
    // but we do want to watch it or spy on it to make sure it executed.
    // Note: the args accepted by spyOn only really make sense when you
    // think of it as module and module method.
    const getExchangeRateSpy = vi.spyOn(utils, 'getExchangeRate')
    getPriceInCurrency(10, 'AUD')

    ///////////////////////////////////////////////////////////////////////////
    //
    // Because getExchangeRateSpy is defined within this test,
    // it will only be relative to this test. However, if we
    // defined it at the top of the describe block, then it would
    // be relative to the entire block, and at this point it will
    // have been called 3 times. In that case, you would probably
    // need to implement logic to reset the spy before each test.
    // There are several options such as mockClear, clearAllMocks,
    // mockReset() and mockRestore(). Thus at the top of describe, we
    // might do this:
    //
    //   beforeEach(() => { vi.clearAllMocks() })
    //   const getExchangeRateSpy = vi.spyOn(utils, 'getExchangeRate')
    //
    // That said, it's just easier to define stuff locally, we can also
    // make set  vi.clearAllMocks() from within vite.config.ts
    //
    //   test: { clearMocks: true }
    //
    // See Mosh video 43.
    //
    ///////////////////////////////////////////////////////////////////////////

    expect(getExchangeRateSpy).toHaveBeenCalledTimes(1)
    expect(getExchangeRateSpy).toHaveBeenCalledWith(
      'USD',
      'AUD' /* expect.any(String) */
    )

    expect(getExchangeRateSpy).toReturnWith(expect.any(Number))
  })
})
