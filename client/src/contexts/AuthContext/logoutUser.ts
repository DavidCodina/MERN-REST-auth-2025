import { handleError, customFetch } from 'utils'
import { ResponsePromise } from 'types'

type Data = null
type LogoutUserResponsePromise = ResponsePromise<Data>
type LogoutUser = () => LogoutUserResponsePromise
type LogoutUserResolvedResponse = Awaited<LogoutUserResponsePromise>

/* ========================================================================

======================================================================== */

export const logoutUser: LogoutUser = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    const json = (await res.json()) as LogoutUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
