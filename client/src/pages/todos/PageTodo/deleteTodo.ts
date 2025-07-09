import { customFetch, handleError } from 'utils'
import { ResponsePromise } from 'types'

type Data = null
type DeleteTodoResponsePromise = ResponsePromise<Data>
type DeleteTodo = (todoId: string) => DeleteTodoResponsePromise
type DeleteTodoResolvedResponse = Awaited<DeleteTodoResponsePromise>

/* ========================================================================

======================================================================== */

export const deleteTodo: DeleteTodo = async (todoId) => {
  // await sleep(2000)

  try {
    // ⚠️ This works because there's a proxy set up in vite.config.ts
    const res = await customFetch(`/api/todos`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: todoId
      })
    })

    const json = (await res.json()) as DeleteTodoResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
