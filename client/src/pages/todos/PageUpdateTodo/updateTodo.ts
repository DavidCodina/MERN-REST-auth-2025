import { customFetch, handleError } from 'utils'
import { ResponsePromise, Todo } from 'types'

type RequestBody = {
  title?: string
  body?: string
}

type Data = Todo | null
type UpdateTodoResponsePromise = ResponsePromise<Data>
type UpdateTodo = (requestBody: RequestBody) => UpdateTodoResponsePromise
type UpdateTodoResolvedResponse = Awaited<UpdateTodoResponsePromise>

/* ========================================================================

======================================================================== */

export const updateTodo: UpdateTodo = async (requestBody) => {
  // await sleep(2000)

  try {
    const res = await customFetch('/api/todos', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const json = (await res.json()) as UpdateTodoResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
