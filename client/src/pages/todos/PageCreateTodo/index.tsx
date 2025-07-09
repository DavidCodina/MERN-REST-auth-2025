import { useNavigate } from 'react-router'

import { useTitle } from 'hooks'
import { Button, HR, Page, PageContainer } from 'components'
import { CreateTodoForm } from './components'

/* ========================================================================
                              PageCreateTodo
======================================================================== */

const PageCreateTodo = () => {
  useTitle('Create Todo')
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
              Create Todo
            </span>
            <span
              className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
              style={{
                position: 'relative'
              }}
            >
              Create Todo
            </span>
          </h1>

          <HR style={{ marginBottom: 50 }} />

          <CreateTodoForm />

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

  /* ======================
          return
  ====================== */

  return renderContent()
}

export default PageCreateTodo
