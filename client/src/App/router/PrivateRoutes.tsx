import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthContext } from 'contexts'
import { Page, PageContainer, Spinner } from 'components'
import { Role } from 'types'

type PrivateRoutes = {
  authorizedRoles?: Role[]
}

const defaultAuthorizedRoles: Role[] = ['USER', 'ADMIN']

/* ========================================================================
                            PrivateRoutes
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component renders loading UI if sessionLoading.
// After that it checks for the session (i.e., if the user is authenticated).
// If the user is not authenticated, it will redirect to the '/login' page.
// However, if the user is authenticated, then italso checks for authorization.
// By default, anyone who is authenticated will have a role of 'USER', unless
// they are an 'ADMIN'.
//
// Basic usage:
//
//   <Route element={<PrivateRoutes />}>
//     <Route path='/protected' element={<PageProtected />} />
//     ...
//   </Route>
//
// The authorizedRoles prop is optional, and should ideally only be used when the
// intention is to set role-based access control above and beyond merely checking
// for authentication:
//
//   <Route element={<PrivateRoutes authorizedRoles={['ADMIN']} />}>
//     <Route path='/admin' element={<PageAdmin />} />
//     ...
//   </Route>
//
// ⚠️ Gotcha: the component can be incorrectly consumed as follows, omitting 'ADMIN':
//
//   ❌ <PrivateRoutes authorizedRoles={['USER']} />
//
// In practice, any time a user is allowed access to a route, so too should an 'ADMIN'.
// To mitigate against this possibility, the actual check also gives access to 'ADMIN'.
//
//   if (typeof role === 'string' && authorizedRoles.includes(role)) || role === 'ADMIN'){
//     isAuthorized = true
//   }
//
///////////////////////////////////////////////////////////////////////////

export const PrivateRoutes = ({
  authorizedRoles = defaultAuthorizedRoles
}: PrivateRoutes) => {
  const location = useLocation()
  const fullPath = `${location.pathname}${location.search}${location.hash}`

  const encodedRedirect = encodeURIComponent(fullPath)
  ///////////////////////////////////////////////////////////////////////////
  //
  // Reading the param from PageLogin.tsx:
  //
  // Any component that needs to access the redirect search param  can
  // do something like this:
  //
  //   const decodedRedirect = decodeURIComponent(encodedRedirect)
  //
  // Actually, decoding the path doesn't seem to be necessary.
  // At least with React Router's searchParams.get('redirect'),
  // it seems to do it automatically. Presently, this is being
  // used only in PageLogin.tsx.
  //
  // Note: React Router has a way to pass this data through <Navigate />,
  // but it's more conventional and (arguably better) to just use search params.
  //
  ///////////////////////////////////////////////////////////////////////////

  const { session, isLoggingOut, sessionLoading } = useAuthContext()
  const role = session?.role
  let isAuthorized = false

  /* ======================
        isAuthorized
  ====================== */

  if (
    (typeof role === 'string' && authorizedRoles.includes(role)) ||
    role === 'ADMIN'
  ) {
    isAuthorized = true
  }

  /* ======================
          return
  ====================== */

  // The !isLoggingOut check is not needed here, but was needed in a similar implementation
  // that used ApolloClient because of the way useQuery() automatically refetched.
  if (sessionLoading /* && !isLoggingOut */) {
    return (
      <Page>
        <PageContainer className='flex items-center justify-center'>
          <Spinner className='border-[2.5px] text-violet-800' size={50} />
        </PageContainer>
      </Page>
    )
  }

  if (!session && isLoggingOut) {
    // console.log('\nCase: user logged out.')
    return <Navigate to={`/login`} replace />
  }
  if (!session) {
    // console.log('\nCase: user not authenticated.')
    return <Navigate to={`/login?redirect=${encodedRedirect}`} replace />
  }

  // If isAuthenticated, but the user is not authorized for the
  // particular route, then go to '/unauthorized' (AKA Forbidden).
  if (!isAuthorized) {
    // console.log('\nCase: user not authorized.')
    return <Navigate to='/unauthorized' replace />
  }

  return <Outlet />
}
