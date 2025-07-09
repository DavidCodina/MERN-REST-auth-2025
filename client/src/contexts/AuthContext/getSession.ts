import { customFetch, handleError } from 'utils'
import { ResponsePromise, Session } from 'types'

type Data = Session | null
type GetSessionResponsePromise = ResponsePromise<Data>
type GetSession = () => GetSessionResponsePromise
type GetSessionResolvedResponse = Awaited<GetSessionResponsePromise>

/* ========================================================================

======================================================================== */

export const getSession: GetSession = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch('/api/auth/session', {
      credentials: 'include'
    })

    const json = (await res.json()) as GetSessionResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
