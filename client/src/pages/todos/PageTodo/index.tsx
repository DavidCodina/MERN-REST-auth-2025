import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Pencil, Trash2 } from 'lucide-react'

import { useTitle } from 'hooks'
import { Alert, Button, HR, Page, PageContainer, Spinner } from 'components'
import { getTodo } from './getTodo'
import { deleteTodo } from './deleteTodo'
import { Todo } from 'types'

/* ========================================================================
                              PageTodo
======================================================================== */

const PageTodo = () => {
  useTitle('Todo')
  const navigate = useNavigate()
  const { id: todoId } = useParams()

  const [loading, setLoading] = React.useState(false)
  const [todo, setTodo] = React.useState<Todo>()
  const [error, setError] = React.useState('')
  const [deletingTodo, setDeletingTodo] = React.useState(false)

  /* ======================
      handleGetTodo()
  ====================== */

  const handleGetTodo = React.useCallback(async () => {
    setLoading(true)
    setError('')

    // No need for try/catch here because the API function catches internally.
    const { success, data } = await getTodo(todoId || '')

    if (success === true && data) {
      setTodo(data)
    } else {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Here we could also check if success === false.
      // That would always work because the API function catches internally,
      // and ALWAYS returns a success property. However, as a general practice,
      // it makes more sense just to set a generic error without even checking for
      // for success. Why? Supppose the API function DID NOT have a standardized response.
      // What if the request then failed because the server or internet was down?
      // In that case, we wouldn't even get a response body back from the server.
      //
      ///////////////////////////////////////////////////////////////////////////
      setError('Unable to get todo.')
    }

    setLoading(false)
  }, [todoId])

  /* ======================
      handleDeleteTodo()
  ====================== */

  const handleDeleteTodo = async () => {
    setDeletingTodo(true)

    // No need for try/catch here because the API function catches internally.
    const result = await deleteTodo(todoId || '')
    const { success } = result

    if (success === true) {
      toast.success('The todo has been deleted!')
      navigate('/todos')
    } else {
      toast.error('Unable to delete the todo!')
    }

    setDeletingTodo(false)
  }

  /* ======================
         useEffect()
  ====================== */

  React.useEffect(() => {
    handleGetTodo()
  }, [handleGetTodo])

  /* ======================
       renderTodo()
  ====================== */

  const renderTodo = (): React.JSX.Element | null => {
    if (error) {
      return (
        <Alert
          className='alert-red mx-auto mb-12 max-w-2xl'
          centerClassName='flex-1'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z' />
              <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
            </svg>
          }
          rightClassName='flex items-center'
          rightSection={
            <Button
              className={`${Alert.redButtonFix} min-w-[100px]`}
              onClick={handleGetTodo}
            >
              Retry
            </Button>
          }
        >
          <Alert.Heading>Error:</Alert.Heading>

          <p className='text-sm'>{error ? error : 'Unable to get the todo!'}</p>
        </Alert>
      )
    }

    if (loading) {
      return (
        <div className='flex min-h-[300px] items-center justify-center'>
          <Spinner className='border-[2.5px] text-violet-800' size={50} />
        </div>
      )
    }

    // Here we are mostly trusting that if not error, then resource will exist.
    // However, we also return null at the very bottom as a fallback.
    if (todo && typeof todo === 'object') {
      return (
        <section
          className='mx-auto mb-3 rounded-lg border border-stone-300 p-3'
          style={{ backgroundColor: '#fafafa', fontSize: 14, maxWidth: 800 }}
        >
          <h5 className='font-bold text-blue-500'>{todo?.title}:</h5>

          <h6
            className='font-bold text-blue-500'
            style={{ fontSize: 14, marginBottom: 25 }}
          >
            Completed:{' '}
            <span
              className={todo?.completed ? 'text-green-500' : 'text-red-500'}
            >
              {todo?.completed?.toString()}
            </span>
          </h6>

          {todo?.body && <p> {todo?.body}</p>}

          <div className='flex justify-center gap-2'>
            <Button
              className='btn-blue btn-sm'
              onClick={() => {
                navigate(`/todos/${todo._id}/update`)
              }}
              style={{ minWidth: 150 }}
              title='Edit Todo'
            >
              <Pencil className='pointer-events-none mr-1 size-[1.25em]' />
              Edit Todo
            </Button>

            <Button
              className='btn-red btn-sm'
              leftSection={
                <Trash2 className='pointer-events-none mr-1 size-[1.25em]' />
              }
              loading={deletingTodo}
              onClick={handleDeleteTodo}
              style={{ minWidth: 150 }}
              title='Delete Todo'
            >
              Delete Todo
            </Button>
          </div>
        </section>
      )
    }

    return null
  }

  /* ======================
          return 
  ====================== */

  return (
    <Page>
      <PageContainer>
        <h1
          className='text-center text-5xl font-black'
          style={{ position: 'relative', marginBottom: 24 }}
        >
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow:
                '0px 0px 1px rgba(0,0,0,1), 0px 0px 1px rgba(0,0,0,1)',
              width: '100%',
              height: '100%'
            }}
          >
            Todo
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Todo
          </span>
        </h1>

        {todoId && (
          <h5
            className='text-center font-bold text-blue-500'
            style={{
              margin: '-10px auto 25px auto',
              textShadow: '0px 1px 1px rgba(0,0,0,0.25)'
            }}
          >
            {todoId && ` ${todoId}`}
          </h5>
        )}

        <HR style={{ marginBottom: 50 }} />

        {renderTodo()}

        <Button
          className='btn-blue btn-sm mx-auto block'
          onClick={() => navigate('/todos')}
          style={{ minWidth: 150 }}
        >
          Back To Todos
        </Button>
      </PageContainer>
    </Page>
  )
}

export default PageTodo
