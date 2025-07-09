async function doAsync(...cbs: any[]) {
  await Promise.all(cbs.map((cb, index) => cb({ index })))
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (count: number) => void
//
// After the test has passed or failed verify that a certain number of assertions was
// called during a test. A useful case would be to check if an asynchronous code was called.
// For example, if we have a function that asynchronously calls two matchers, we can assert
// that they were actually called.
//
// In the following example we are testing doAsync(). However, by expecting two assertions to have
// been called we are implicitly testing that doAsync() has executed its callbacks and that there
// is a truthy arguments passed to each callack. This is kind of like an alternative to spying
// on the callbacks.
//
///////////////////////////////////////////////////////////////////////////

describe('expect.assertions...', () => {
  test('all assertions are called', async () => {
    expect.assertions(2)

    function callback1(data: { index: number }) {
      expect(data).toBeTruthy()
    }

    function callback2(data: { index: number }) {
      expect(data).toBeTruthy()
    }

    await doAsync(callback1, callback2)
  })
})
