import { getData } from './'

// https://runthatline.com/how-to-mock-fetch-api-with-vitest/
// https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/learn/lecture/31878062#overview
// https://www.leighhalliday.com/mock-fetch-jest
// https://stackoverflow.com/questions/73597037/how-to-test-mock-a-fetch-api-in-a-react-component-using-jest
// See also: https://www.npmjs.com/package/vitest-fetch-mock

/* ======================

====================== */

const mockData = [
  {
    userId: 1,
    id: 1,
    title: 'Do Stuff 1',
    completed: false
  },
  {
    userId: 2,
    id: 2,
    title: 'Do Stuff 2',
    completed: false
  },
  {
    userId: 3,
    id: 3,
    title: 'Do Stuff 3',
    completed: false
  }
]

/* ======================

====================== */
// mockFetch is the function we will pass to vi.fn().
// In other words, testFetch will be vi.fn(mockFetch).
// This allows us to sometimes change the .mockImplementationOnce()

const mockFetch: typeof fetch = (
  input, //: RequestInfo | URL,
  init // ?: RequestInit | undefined
) => {
  void input
  void init

  const mockResponse = {
    ok: true,
    json: () => {
      return Promise.resolve(mockData)
    }
  } as Response

  // return Promise.resolve(mockResponse)
  return new Promise((resolve, _reject) => resolve(mockResponse))
}

const testFetch = vi.fn(mockFetch)

/* ========================================================================

======================================================================== */

describe('getData()', () => {
  // Before doing this in beforeAll(), it wouldn't work and
  // would result in all sorts of errors.
  beforeAll(() => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // ❌ This will NOT work: global.fetch = vi.fn(mockFetch)
    //
    // ✅ This will work:      global.fetch = mockFetch
    // In this case, the example I saw also did this in a beforeAll(() => { })
    // just as we are doing here. It also did this:
    //
    //   const unmockedFetch = global.fetch
    //   ...
    //   afterAll(() => { global.fetch = unmockedFetch })
    //
    // ✅  The Academind Udemy tutorial does this
    //     https://vitest.dev/api/vi.html#vi-stubglobal
    //
    //  vi.stubGlobal('fetch', vi.fn(mockFetch))
    //
    // Note: this will be remembered until you call vi.unstubAllGlobals()
    // https://vitest.dev/api/vi.html#vi-unstuballglobals
    //
    ///////////////////////////////////////////////////////////////////////////
    vi.stubGlobal('fetch', testFetch)
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  /* ======================

  ====================== */

  test('should work', async () => {
    const URL = 'https://jsonplaceholder.typicode.com/todos?_limit=1'
    const { data, success, message } = await getData(URL)

    expect(data).not.toBeNull()
    expect(success).toBe(true)
    expect(message).toBe('Request successful.')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(URL)
    expect(data).toHaveLength(3)
  })

  /* ======================

  ====================== */

  test('should also work', async () => {
    // Here we are creating a specific 'mockFetch' implementation
    // to test what happens in getData() when ok: false.
    testFetch.mockImplementationOnce(
      (input: RequestInfo | URL, init?: RequestInit | undefined) => {
        void input
        void init

        const mockResponse = {
          ok: false,
          json: () => {
            return Promise.resolve(mockData)
          }
        } as Response

        // return Promise.resolve(mockResponse)
        return new Promise((resolve, _reject) => resolve(mockResponse))
      }
    )

    const URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10'

    try {
      await getData(URL)

      expect(true).toBe(true)
    } catch (err: any) {
      const { data, success, message } = err

      expect(data).toBeNull()
      expect(success).toBe(false)
      expect(message).toBe('Request not successful. (1)')

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenCalledWith(URL)
    }
  })
})
