import { useState } from 'react'

import { useTitle } from 'hooks'
import { Button, HR, Page, PageContainer } from 'components'

/* ========================================================================
                              PageErrorDemo
======================================================================== */
//////////////////////////////////////////////////////////////////////////
//
// Test react-error-boundary synchronous:
//
//   let condition = false
//   condition = true
//   if (condition) {
//     throw Error('Error: A page in the app crashed!')
//   }
//
// Test react-error-boundary asynchronous:
// (needs: import { useErrorHandler } from 'react-error-boundary')
//
//   const handleError = useErrorHandler()
//   setTimeout(() => {
//     try {
//       throw new Error('Kaboom!')
//     } catch (err) {
//       handleError(err)
//     }
//   }, 3000)
//
// Test react-error-boundary rerender:
// In the async example above, we manually had to catch the error then set it using
// react-error-boundary's useErrorHandler. That said, react error boundary will
// trigger on rerender when something goes wrong (no  need to manually set anything).
// The point being that async code itself will not trigger an error boundary, but
// the potential results of an async API call would possibly trigger the error boundary
// once the data was set in state.
//
//   const [items, setItems] = useState<any>([])
//
//   <Button
//     className='block mx-auto'
//     color='green'
//     onClick={() => { setItems(undefined) }}
//   >
//     Break The Page!
//   </Button>
//
//   {items.map(() => null)}
//
// Note: React error boundaries do not handle compilation time errors.
// For example, putting abc123 in your code (i.e. an undefined variable)
// Thus, an uncaught reference error will NEVER trigger react error boundary.
// Instead this triggers the webpack error overlay.
//
///////////////////////////////////////////////////////////////////////////

const PageErrorDemo = () => {
  useTitle('Error Demo')

  const [items, setItems] = useState<any>([])

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
            Error Boundary Demo
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Error Boundary Demo
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <Button
          onClick={() => {
            setItems(undefined)
          }}
          className='btn-red btn-sm mx-auto block'
          style={{ cursor: 'pointer', margin: '0 auto' }}
        >
          Break The Page!
        </Button>

        {items.map(() => null)}
      </PageContainer>
    </Page>
  )
}

export default PageErrorDemo
