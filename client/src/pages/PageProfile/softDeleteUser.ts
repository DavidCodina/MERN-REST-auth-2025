import { customFetch, handleError } from 'utils'
import { ResponsePromise, User } from 'types'

type Data = User | null
type SoftDeleteUserResponsePromise = ResponsePromise<Data>
type SoftDeleteUser = () => SoftDeleteUserResponsePromise
type SoftDeleteUserResolvedResponse = Awaited<SoftDeleteUserResponsePromise>

/* ========================================================================

======================================================================== */

export const softDeleteUser: SoftDeleteUser = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch(`/api/users/soft-delete`, {
      credentials: 'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const json = (await res.json()) as SoftDeleteUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
