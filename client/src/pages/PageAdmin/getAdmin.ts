import { customFetch, handleError } from 'utils'
import { ResponsePromise, UnsafeUser } from 'types'

type Data = UnsafeUser | null
type GetAdminResponsePromise = ResponsePromise<Data>
type GetAdmin = () => GetAdminResponsePromise
type GetAdminResolvedResponse = Awaited<GetAdminResponsePromise>

/* ========================================================================

======================================================================== */

export const getAdmin: GetAdmin = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch('/api/admin/test', {
      credentials: 'include'
    })

    const json = (await res.json()) as GetAdminResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
