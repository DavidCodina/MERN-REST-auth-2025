// Third-party imports
import { Fragment, Suspense } from 'react'
import { Outlet } from 'react-router'
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Custom imports
import { useThemeContext } from 'contexts'

import {
  Menu,
  FixedGlobalSpinner,
  // GlobalSpinner,
  SuspenseFallback,
  IdleTimer
} from './components'

import PageError from 'pages/PageError'

/* ========================================================================
                              MainLayout
======================================================================== */

export const MainLayout = () => {
  const { mode } = useThemeContext()

  /* ======================
        handleError()
  ====================== */

  const handleError = (_error: any, _errorInfo: any) => {
    // This is where you'd call your logging service.
    // console.log('Error: ', error)
    // console.log('Error Info: ', errorInfo)
  }

  /* ======================
        handleReset()
  ====================== */

  const handleReset = () => {
    // console.log('handleReset() was called.')
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <ToastContainer
        autoClose={3000}
        theme={mode === 'dark' ? 'dark' : 'light'}
      />

      <div
        className={`flex w-full flex-1 transition-[background] duration-300 ease-linear dark:bg-[var(--dark-body-color)] dark:text-[var(--dark-text-color)]`}
      >
        <ErrorBoundary
          FallbackComponent={PageError}
          onError={handleError}
          onReset={handleReset}
        >
          <FixedGlobalSpinner delay={750} />

          {/* The GlobalSpinner will run while any react-router data loader is loading. 
          In the absence of GlobalSpinner, the default behavior of react-router is to
          delay/await page switching until the loader function completes. The GlobalSpinner completely
          replaces all content. It's like a separate Page. For this reason, I generally prefer using
          a FixedGlobalSpinner. This component sits on top of the content and works in conjunction with
          the default behavior of delaying page transition. */}

          {/* <GlobalSpinner delay={750}> */}

          {/* If the lazy loading of the page is not awaited within the data loader, then
          once the loader has completed, the page will be lazy loaded. 
            
            Be aware that:
            1. The lazy loading of the page happens only once, so if you've already been to the page, the fallback won't fire.

            2. If you refresh the page, you will not see the GlobalSpinner or the Suspense fallback.
            Instead, by default you will see a blank screen. This can be mitigated by using fallbackElement
            prop on RouterProviderer

              <RouterProvider 
                router={router} 
                fallbackElement={<div className='fixed inset-0 text-6xl'>Loading</div>} 
              />
             */}
          <Suspense fallback={<SuspenseFallback />}>
            <Outlet context={{ test: 'Outlet value!' }} />
          </Suspense>
          {/* </GlobalSpinner> */}
          <IdleTimer />
        </ErrorBoundary>

        {/* For precedence, it's important that the <Menu /> comes after the other JSX. */}
        <Menu />
      </div>
    </Fragment>
  )
}

export default MainLayout
