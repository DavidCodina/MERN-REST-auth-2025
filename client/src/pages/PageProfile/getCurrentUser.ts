import { customFetch, handleError } from 'utils'
import { ResponsePromise, UnsafeUser } from 'types'

type Data = UnsafeUser | null
type GetCurrentUserResponsePromise = ResponsePromise<Data>
type GetCurrentUser = () => GetCurrentUserResponsePromise
type GetCurrentUserResolvedResponse = Awaited<GetCurrentUserResponsePromise>

/* ========================================================================

======================================================================== */

export const getCurrentUser: GetCurrentUser = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch('/api/users/current', {
      credentials: 'include'
    })

    const json = (await res.json()) as GetCurrentUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
