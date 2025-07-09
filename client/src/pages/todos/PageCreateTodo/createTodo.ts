import { customFetch, handleError } from 'utils'
import { ResponsePromise, Todo } from 'types'

type RequestBody = {
  title: string
  body?: string
}

type Data = Todo | null
type CreateTodoResponsePromise = ResponsePromise<Data>
type CreateTodo = (requestBody: RequestBody) => CreateTodoResponsePromise
type CreateTodoResolvedResponse = Awaited<CreateTodoResponsePromise>

/* ========================================================================

======================================================================== */

export const createTodo: CreateTodo = async (requestBody) => {
  // await sleep(2000)

  try {
    const res = await customFetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const json = (await res.json()) as CreateTodoResolvedResponse

    return json
  } catch (err) {
    return handleError(err)
  }
}
