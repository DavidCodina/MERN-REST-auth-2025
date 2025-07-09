import { authEvents } from './authEvents'

type CustomFetch = typeof fetch

const defaultRequestInit: RequestInit = {
  // Setting 'Content-Type': 'application/json' is convenient, but make
  // sure to override headers when sending multipart/form-data requests.
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
}

/* ========================================================================
                                customFetch
======================================================================== */

/** A thin wrapper around native fetch() that implements the "silent refresh" pattern. */
export const customFetch: CustomFetch = async (
  input,
  init = defaultRequestInit
) => {
  const options: RequestInit = {
    ...defaultRequestInit,
    ...init
  }

  let res = await fetch(input, options)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Handle 401 Case:
  //
  // Note: In some "silent refresh" implementations, there is a danger of
  // creating an infinite loop if you automatically retry on every 401,
  // including the retry itself. However, that's not an issue here at all.
  //
  ///////////////////////////////////////////////////////////////////////////

  if (res.status === 401) {
    const refreshResponse = await fetch('/api/auth/refresh-token', {
      credentials: 'include'
    })

    // const _refreshResponseBody = await refreshResponse.json()

    if (refreshResponse.ok) {
      res = await fetch(input, options)
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Optional: Log user out if '/api/auth/refresh-token' comes back with !ok.
    //
    // In the case of !refreshResponse.ok, we may want to check if we got
    // a 401 back. In that scenario, one can optionally implement logic that
    // logs the user out. A naive approach would entail wrapping customFetch()
    // in a useCustomFetch() hook. Then one could access useAuthContext() from
    // within that. However, that creates a problem!
    //
    // It then means that customFetch() itself can no longer be used within
    // API functions. Why? Because the API function itself would also need
    // to be a React hook. So... What do to?
    //
    // Solution: Create an authEvents utility that emits an 'AUTH_FAILURE' event.
    // Then have AuthContext listen for that event and handle it accordingly.
    //
    //# Todo: Check specifically for the 401 http status code.
    //
    ///////////////////////////////////////////////////////////////////////////
    else {
      authEvents.emit('AUTH_FAILURE')
      // ⚠️ Note: if navigating to a protected page that then makes a protected API call,
      // you'll inevitably see the page for a brief flash prior to the API call failing and
      // then being redirected to '/login'.
    }
  }

  return res
}
