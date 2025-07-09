import { BrowserRouter } from 'react-router'
import { render } from '@testing-library/react'
import { AppProvider } from 'contexts'

///////////////////////////////////////////////////////////////////////////
//
// BrowserRouter worked okay in the Bonnie Schulkin tutorial.
// However in that case we weren't actually testing components that
// used the data loader features like the loader prop.
//
//
// The problems arise when we try to do:
//
//   const loaderData = useLoaderData() as any
//
// We end up with an error in our test:
//
//  Error: useLoaderData must be used within a data router.
//
// The big problem for test-utils.tsx with React Router 6.4+
// is that data routers are self-closing, so we can't simply
// pass children through...
//
// One solution is to build a helper function that will
// streamline the necessary setup for a mini router.
//
//   import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router'
//   import { RootLayout, MainLayout } from 'layouts'
//   type RoutePropsWithoutPath = Omit<RouteProps, 'path'>
//
//   export const createMiniRouter = (props: RoutePropsWithoutPath) => {
//     const routeProps = props as RouteProps
//     const routes = createRoutesFromElements(
//       <Route element={<RootLayout />}>
//         <Route element={<MainLayout />}>
//           <Route path='/' {...routeProps} />
//         </Route>
//       </Route>
//     )
//     const router = createBrowserRouter(routes)
//     const minRouter = <RouterProvider router={router} />
//     return minRouter
//   }
//
// Then in the test file, we just do something like this:
//
//   describe('PageRandom', () => {
//     test("should render 'Random'", async () => {
//       const miniRouter = createMiniRouter({ element: <PageRandom />, loader: randomLoader })
//       render(miniRouter)
//
//       // screen.debug()
//
//       ///////////////////////////////////////////////////////////////////////////
//       //
//       // Gotcha: Without the MainLayout in the createMiniRouter(), we could just do:
//       //
//       //   const title = await screen.findByText('Random')
//       //
//       // However, a NavLink in MainRouter also has the text 'Random', so we need
//       // to be more specific.
//       //
//       // Also, it may seem kind of weird that we need to use findByRole() when we're
//       // not really waiting on anything async. In fact, we probably are if we're lazy
//       // loading a component. I'm pretty sure the import() function returns  a promise.
//       // If that's not it, then it could potentially be something in the internal
//       // operations of React Router.
//       //
//       ///////////////////////////////////////////////////////////////////////////
//       const title = await screen.findByRole('heading', { level: 1, name: 'Random' })
//       expect(title).toBeInTheDocument()
//     })
//   })
//
// In this case, make sure that your importing from
// import { render, screen } from '@testing-library/react'
// and not 'test-utils'
//
// It's not as nice as having a custom render that automatically
// wraps your code, but it's the next best thing.
//
// So... The custom render IS STILL USEFUL for components that do
// not depend on the data router, but if you need a data router,
// then createMiniRouter() is the way to go
//
///////////////////////////////////////////////////////////////////////////

//# Add ThemeProvider............
const renderWithProviders = ({ children }: any) => {
  return (
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  )
}

const customRender = (ui: any, options?: any) => {
  return render(ui, { wrapper: renderWithProviders, ...options })
}

export * from '@testing-library/react' // re-export everything
export { customRender as render } // override render method
