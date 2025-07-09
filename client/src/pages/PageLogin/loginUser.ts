import { customFetch, handleError } from 'utils'
import { ResponsePromise, Session } from 'types'

type RequestBody = {
  email: string
  password: string
}

type Data = Session | null
type LoginUserResponsePromise = ResponsePromise<Data>
type LoginUser = (requestBody: RequestBody) => LoginUserResponsePromise
type LoginUserResolvedResponse = Awaited<LoginUserResponsePromise>

/* ========================================================================

======================================================================== */

export const loginUser: LoginUser = async (requestBody) => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const json = (await res.json()) as LoginUserResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
