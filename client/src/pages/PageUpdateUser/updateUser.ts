import { customFetch, handleError } from 'utils'
import { ResponsePromise, UnsafeUser } from 'types'

type RequestBody = {
  userName?: string
  firstName?: string
  lastName?: string
  email?: string
  //# image?: File
}

type Data = UnsafeUser | null
type UpdateUserResponsePromise = ResponsePromise<Data>
type UpdateUser = (requestBody: RequestBody) => UpdateUserResponsePromise
type UpdateUserResolvedResponse = Awaited<UpdateUserResponsePromise>

/* ========================================================================

======================================================================== */

export const updateUser: UpdateUser = async (requestBody) => {
  // await sleep(2000)

  try {
    const res = await customFetch('/api/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const json = (await res.json()) as UpdateUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
