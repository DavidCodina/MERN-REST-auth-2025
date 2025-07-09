import { customFetch, handleError } from 'utils'
import { ResponsePromise, Session } from 'types'

type RequestBody = {
  userName: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

type Data = Session | null
type CreateUserResponsePromise = ResponsePromise<Data>
type CreateUser = (requestBody: RequestBody) => CreateUserResponsePromise
type CreateUserResolvedResponse = Awaited<CreateUserResponsePromise>

/* ========================================================================

======================================================================== */

export const createUser: CreateUser = async (requestBody) => {
  // await sleep(2000)

  try {
    const res = await customFetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const json = (await res.json()) as CreateUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
