import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseFetchOptions extends RequestInit {
  autoInvoke?: boolean
}

type ResponseData<T> = {
  data: T | null
  message: string
  success: boolean
}

const defaultErrorResponse = {
  data: null,
  message: 'Request failed.',
  success: false
}

/* ========================================================================
                                useFetch()      
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://mantine.dev/hooks/use-fetch/
// https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/hooks/src/use-fetch/use-fetch.ts
//
// useFetch hook sends a GET request to the specified URL and returns the response data, loading state,
// error, refetch and abort functions.
//
//   const { data, loading, error, refetch, abort, status } = useFetch<Data>(
//     'https://jsonplaceholder.typicode.com/todos/',
//     {
//       // autoInvoke: false
//       credentials: 'include'
//     }
//   )
//
// That said, because you can pass options, it's also possible to send POST, PATCH, DELETE, etc.
//
//   const { data, loading, error, refetch, abort, status } = useFetch<Data>(
//     'https://jsonplaceholder.typicode.com/todos/',
//     {
//       method: 'POST',
//       body: JSON.stringify({ title: 'My New Todo', body: 'Bla, bla, bla...', userId: 1 }),
//       headers: { 'Content-type': 'application/json; charset=UTF-8' }
//     }
//   )
//
// This useFetch() implementation has subsequently been modified, so that it very specifically
// expects data to always be ResponseData<T>. Thus, this hook is now useful for my
// specific application needs, but may need to be modified depending on the conventions
// for a particular project.
//
//   type PaginatedProductsData = {
//     products: Product[]
//     count: number
//     previousPage: number | null
//     currentPage: number
//     nextPage: number | null
//     isNextPage: boolean
//     isPreviousPage: boolean
//     pages: number
//   }
//
//   type Data = PaginatedProductsData | null
//
//   const { data, loading, error, refetch, abort, status } = useFetch<Data>('/api/products')
//
//
// See also https://github.com/dai-shi/react-hooks-fetch
//
///////////////////////////////////////////////////////////////////////////

export function useFetch<T = unknown>(
  url: string,
  { autoInvoke = true, ...options }: UseFetchOptions = {}
) {
  const [data, setData] = useState<ResponseData<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // status state was added to the original Mantine version since it's
  // more informative than just loading state
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const controller = useRef<AbortController | null>(null)

  /* ======================
        refetch()
  ====================== */

  const refetch = useCallback(() => {
    if (!url) {
      return
    }

    if (controller.current) {
      controller.current.abort()
    }

    controller.current = new AbortController()

    setLoading(true)
    setStatus('pending')

    return fetch(url, {
      signal: controller.current.signal,
      credentials: 'include', // Added this for custom useFetch()
      ...options
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        setData(res as ResponseData<T>)
        setLoading(false)
        setStatus('success')
        return res as T
      })
      .catch((err) => {
        setLoading(false)

        if (err.name === 'AbortError') {
          setStatus('idle')
        } else {
          setStatus('error')
        }

        if (err.name !== 'AbortError') {
          setError(err)
        }

        // The Mantine version retrhows the err. I don't think rethrowing is a good idea.
        // It results in an uncaught error: Uncaught (in promise) TypeError: Failed to fetch.
        // This version is very specific to my use case in that it returns the standard
        // error response, which conforms to ResponseData<T>
        setData(defaultErrorResponse)
        return defaultErrorResponse
      })
  }, [url]) // eslint-disable-line

  /* ======================
          abort()
  ====================== */

  const abort = useCallback(() => {
    if (controller.current) {
      controller.current?.abort()
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (autoInvoke) {
      refetch()
    }

    return () => {
      if (controller.current) {
        controller.current.abort()
      }
    }
  }, [refetch, autoInvoke])

  /* ======================
          return
  ====================== */

  return { data, loading, status, error, refetch, abort }
}
