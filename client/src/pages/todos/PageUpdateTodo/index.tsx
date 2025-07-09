import { useNavigate, useParams } from 'react-router'

import { useTitle } from 'hooks'
import { Button, HR, Page, PageContainer } from 'components'
import { UpdateTodoForm } from './components'

/* ========================================================================
                            PageUpdateTodo
======================================================================== */

const PageUpdateTodo = () => {
  useTitle('Update Todo')
  const { id } = useParams()
  const navigate = useNavigate()

  /* ======================
        renderContent
  ====================== */

  const renderContent = () => {
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
              Update Todo
            </span>
            <span
              className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
              style={{
                position: 'relative'
              }}
            >
              Update Todo
            </span>
          </h1>

          {id && (
            <h5
              className='text-center font-bold text-blue-500'
              style={{
                margin: '-10px auto 25px auto',
                textShadow: '0px 1px 1px rgba(0,0,0,0.25)'
              }}
            >
              {id && ` ${id}`}
            </h5>
          )}

          <HR style={{ marginBottom: 50 }} />

          <UpdateTodoForm />

          <Button
            className='btn-blue btn-sm mx-auto block'
            onClick={() => navigate(-1)}
            style={{ minWidth: 150 }}
          >
            Go Back
          </Button>
        </PageContainer>
      </Page>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}

export default PageUpdateTodo
