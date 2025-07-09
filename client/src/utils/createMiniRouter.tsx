import {
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouteProps
} from 'react-router'
import { RootLayout, MainLayout } from 'layouts'

type RoutePropsWithoutPath = Omit<RouteProps, 'path'>

export const mockLoader = () => {
  return {
    data: { test: 'Testing 123...' },
    success: true,
    message: 'Request success!',
    status: 200
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Problem:
//
// test("should render 'Testing 123...'", async () => {
//   render(<PagePosts />)
//   const title = await screen.findByText('Testing 123...')
//   expect(title).toBeInTheDocument()
// })
//
// Will result in:
//
//   Error: useLoaderData must be used within a data router.
//
// Apparently, MemoryRouter, BrowserRouter and HashRouter are all data routers.
// However, they MUST be generated using RouterProvider -  a self closing component
// that takes a router prop, which is created by a create???Router function.
//
// In any case, we need a way to provide the router to the component. Essentially,
// we want to wrap the component. The only issue is that createBrowserRouter/createMemoryRouter creates
// a self-closing router, so we can no longer just wrap the component with the provider.
//
// This also means that the setup example found here: // https://testing-library.com/docs/react-testing-library/setup/
// WILL NOT WORK! Why? Because wrapper works specifically with a component that accepts children, and
// and the self-closing routers DO NOT ACCEPT CHILDREN.
//
// Solution:
//
//   test("should render 'Testing 123...'", async () => {
//     const routes = createRoutesFromElements(<Route path='/' loader={mockLoader} element={<PagePosts />} />)
//     const router = createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })
//
//     render(<RouterProvider router={router} />)
//     const title = await screen.findByText('Testing 123...')
//     expect(title).toBeInTheDocument()
//   })
//
// That said, there may be other providers (i.e., global contexts) that we
// need to provide to the page component. Thus, this is a better approach:
//
//   test("should render 'Testing 123...'", async () => {
//     const routes = createRoutesFromElements(
//       <Route element={<RootLayout />}>
//         <Route element={<MainLayout />}>
//           <Route path='/' loader={mockLoader} element={<PagePosts />} />
//         </Route>
//       </Route>
//     )
//
//     // https://reactrouter.com/en/main/routers/create-memory-router
//      const router = createMemoryRouter(routes, {
//       initialEntries: ['/'],
//       initialIndex: 0
//     })
//
//     render(<RouterProvider router={router} />)
//     const title = await screen.findByText('Testing 123...')
//
//     expect(title).toBeInTheDocument()
//   })
//
// Finally, for simple use cases that do not require multiple routes, you
// can use createMiniRouter() from utils.
//
// This is the way!
//
///////////////////////////////////////////////////////////////////////////

// Important: See setupTests.ts for matchMedia mock that createMiniRouter depends on (because of ThemeProvider).
export const createMiniRouter = (props: RoutePropsWithoutPath) => {
  const routeProps = props as RouteProps

  const routes = createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route element={<MainLayout />}>
        <Route path='/' {...routeProps} />
      </Route>
    </Route>
  )

  const router = createMemoryRouter(routes)
  const minRouter = <RouterProvider router={router} />
  return minRouter
}
