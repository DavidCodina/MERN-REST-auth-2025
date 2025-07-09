import * as React from 'react'
import { useNavigate } from 'react-router'

import { useTitle } from 'hooks'
import { Alert, Button, HR, Page, PageContainer, Spinner } from 'components'
import { getTodos } from './getTodos'
import { Todo } from 'types'

/* ========================================================================
                                  PageTodos
======================================================================== */

const PageTodos = () => {
  useTitle('Todos')
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(false)
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [error, setError] = React.useState('')

  /* ======================
      handleGetTodos()
  ====================== */

  const handleGetTodos = async () => {
    setError('')
    setLoading(true)

    // No need for try/catch here because the API function catches internally.
    const { success, data } = await getTodos()

    if (success == true && data) {
      setTodos(data)

      ///////////////////////////////////////////////////////////////////////////
      //
      // Here we could also check if success === false.
      // That would always work because the API function catches internally,
      // and ALWAYS returns a success property. However, as a general practice,
      // it makes more sense just to set a generic error without even checking
      // for success. Why? Supppose the API function DID NOT have a standardized response.
      // What if the request then failed because the server or internet was down?
      // In that case, we wouldn't even get a response body back from the server.
      //
      ///////////////////////////////////////////////////////////////////////////
    } else {
      setError('Unable to get todos.')
    }

    setLoading(false)
  }

  /* ======================
         useEffect()
  ====================== */

  React.useEffect(() => {
    handleGetTodos()
  }, [])

  /* ======================
          return
  ====================== */

  const renderTodos = (): React.JSX.Element | React.JSX.Element[] | null => {
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
              onClick={handleGetTodos}
            >
              Retry
            </Button>
          }
        >
          <Alert.Heading>Error:</Alert.Heading>

          <p className='text-sm'>
            {error ? error : 'Unable to get the todos!'}
          </p>
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

    if (!Array.isArray(todos) || (Array.isArray(todos) && todos.length === 0)) {
      return (
        <Alert
          className='alert-blue mx-auto mb-12 max-w-2xl'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
              <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
            </svg>
          }
        >
          <Alert.Heading>Info:</Alert.Heading>

          <p className='text-sm'>Looks like you don't have any todos!</p>
        </Alert>
      )
    }

    if (Array.isArray(todos) && todos.length > 0) {
      return (
        <div className='mx-auto max-w-3xl space-y-4'>
          {todos.map((todo: Todo) => {
            return (
              <div // eslint-disable-line
                key={todo._id}
                className='rounded-lg border border-blue-500 bg-white p-4'
                onClick={() => {
                  navigate(`/todos/${todo._id}`)
                }}
                role='button'
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                {todo.title}
              </div>
            )
          })}
        </div>
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
            Todos
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Todos
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <Button
          className='btn-green btn-sm mx-auto mb-4 block'
          onClick={() => navigate('/todos/create')}
        >
          Create A Todo
        </Button>

        {renderTodos()}
      </PageContainer>
    </Page>
  )
}

export default PageTodos
