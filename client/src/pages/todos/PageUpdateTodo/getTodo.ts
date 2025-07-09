import { customFetch, handleError } from 'utils'
import { ResponsePromise, Todo } from 'types'

type Data = Todo | null
type GetTodoResponsePromise = ResponsePromise<Data>
type GetTodo = (todoId: string) => GetTodoResponsePromise
type GetTodoResolvedResponse = Awaited<GetTodoResponsePromise>

/* ========================================================================

======================================================================== */

export const getTodo: GetTodo = async (todoId) => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch(`/api/todos/${todoId}`, {
      credentials: 'include'
    })

    const json = (await res.json()) as GetTodoResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
