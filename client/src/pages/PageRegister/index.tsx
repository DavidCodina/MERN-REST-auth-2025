import { Navigate } from 'react-router'

import { useAuthContext } from 'contexts'
import { useTitle } from 'hooks'
import { HR, Page, PageContainer } from 'components'
import { RegisterForm } from './components'

/* ========================================================================
                              PageRegister
======================================================================== */

const PageRegister = () => {
  useTitle('Register')
  const { session } = useAuthContext()

  /* ======================
          return
  ====================== */

  if (session) {
    return <Navigate to={'/todos'} replace />
  }

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
            Register
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Register
          </span>
        </h1>
        <HR style={{ marginBottom: 50 }} />

        <RegisterForm />
      </PageContainer>
    </Page>
  )
}

export default PageRegister
