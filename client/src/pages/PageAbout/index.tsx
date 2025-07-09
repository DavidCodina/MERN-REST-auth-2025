// import { useThemeContext } from 'contexts'
import { useTitle } from 'hooks'
import { HR, Page, PageContainer } from 'components'

/* ========================================================================
                                PageAbout
======================================================================== */

const PageAbout = () => {
  useTitle('About')

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
            About
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            About
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />
      </PageContainer>
    </Page>
  )
}

export default PageAbout
