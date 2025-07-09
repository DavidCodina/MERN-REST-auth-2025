import { customFetch, handleError } from 'utils'
import { ResponsePromise } from 'types'

type Data = null
type DeleteUserResponsePromise = ResponsePromise<Data>
type DeleteUser = () => DeleteUserResponsePromise
type DeleteUserResolvedResponse = Awaited<DeleteUserResponsePromise>

/* ========================================================================

======================================================================== */

export const deleteUser: DeleteUser = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch(`/api/users`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const json = (await res.json()) as DeleteUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
