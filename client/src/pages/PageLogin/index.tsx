import { Navigate, useSearchParams } from 'react-router'

import { useAuthContext } from 'contexts'
import { useTitle } from 'hooks'
import { HR, Page, PageContainer } from 'components'
import { LoginForm } from './components'

/* ========================================================================
                               PageLogin
======================================================================== */

const PageLogin = () => {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')
  // Even though the redirect was likely encoded, you shouldn't need to decode it here.
  // At least with React Router's searchParams.get('redirect'), it seems to do it automatically.
  // const decodedRedirect = typeof redirect === 'string' ? decodeURIComponent(redirect) : ''

  useTitle('Login')

  const { session } = useAuthContext()

  /* ======================
          return
  ====================== */

  const fullPath =
    redirect && typeof redirect === 'string' ? redirect : '/todos'

  if (session) {
    return <Navigate to={fullPath} replace />
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
            Login
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Login
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <LoginForm />
      </PageContainer>
    </Page>
  )
}

export default PageLogin
