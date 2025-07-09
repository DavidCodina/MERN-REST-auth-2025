import { customFetch, handleError } from 'utils'
import { ResponsePromise, Todo } from 'types'

type Data = Todo[] | null
type GetTodosResponsePromise = ResponsePromise<Data>
type GetTodos = () => GetTodosResponsePromise
type GetTodosResolvedResponse = Awaited<GetTodosResponsePromise>

/* ========================================================================

======================================================================== */

export const getTodos: GetTodos = async () => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch('/api/todos', {
      credentials: 'include'
    })

    const json = (await res.json()) as GetTodosResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
