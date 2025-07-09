async function doAsync(...cbs: any[]) {
  await Promise.all(cbs.map((cb, index) => cb({ index })))
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: () => void
//
// After the test has passed or failed verify that at least one assertion was called
// during a test. A useful case would be to check if an asynchronous code was called.
// For example, if you have a code that calls a callback, we can make an assertion
// inside a callback, but the test will always pass if we don't check if an assertion was called.
//
// This seems similar to expect.assertions, but merely concerned with whether there was an assertion
// rather than the specific number. To this end, we really don't even need to test whether data was
// truthy. If all we wanted to know is if the callback ran, we could just assert expect(true).toBe(true)
//
///////////////////////////////////////////////////////////////////////////

describe('expect.hasAssertions...', () => {
  test('callback assertions should run.', async () => {
    expect.hasAssertions()

    function callback1(data: { index: number }) {
      expect(data).toBeTruthy()
    }

    await doAsync(callback1)
  })
})
