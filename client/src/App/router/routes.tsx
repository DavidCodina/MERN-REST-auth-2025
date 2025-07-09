import { createRoutesFromElements, Route, Navigate } from 'react-router'
import { RootLayout, MainLayout } from 'layouts'

import { PrivateRoutes } from './PrivateRoutes'
import { ConditionalRoute } from './ConditionalRoute'

import PageHome from 'pages/PageHome' // Should NOT be lazy loaded.
import PageRegister from 'pages/PageRegister'
import PageLogin from 'pages/PageLogin'
import PageProfile from 'pages/PageProfile'
import PageUpdateUser from 'pages/PageUpdateUser'

import PageAdmin from 'pages/PageAdmin'
import PageTodos from 'pages/todos/PageTodos'
import PageTodo from 'pages/todos/PageTodo'
import PageCreateTodo from 'pages/todos/PageCreateTodo'
import PageUpdateTodo from 'pages/todos/PageUpdateTodo'
import PageAbout from 'pages/PageAbout'
import PageNotFound from 'pages/PageNotFound'
import PageUnauthorized from 'pages/PageUnauthorized'
import PageErrorDemo from 'pages/PageErrorDemo'

import { RouterFallback } from './RouterFallback'

const condition = true // Used for isAllowed={true} (conditional routes demo) below.

/* ========================================================================
                                   Routes      
======================================================================== */

export const routes = createRoutesFromElements(
  <Route element={<RootLayout />} hydrateFallbackElement={<RouterFallback />}>
    <Route element={<MainLayout />}>
      <Route path='/' element={<PageHome />} />
      <Route path='/home' element={<Navigate to='/' replace />} />

      <Route path='/register' element={<PageRegister />} />

      <Route path='/login' element={<PageLogin />} />

      {/* Only authenticated users may access this content. */}
      <Route
        element={
          <PrivateRoutes
          // authorizedRoles={['USER', 'ADMIN']} // Default
          />
        }
      >
        <Route path='/profile' element={<PageProfile />} />
        <Route path='/user/update' element={<PageUpdateUser />} />

        <Route path='/todos' element={<PageTodos />} />
        <Route path='/todos/:id' element={<PageTodo />} />

        <Route path='/todos/create' element={<PageCreateTodo />} />

        <Route path='/todos/:id/update' element={<PageUpdateTodo />} />
      </Route>

      {/* Only admin users may view this content. */}
      <Route element={<PrivateRoutes authorizedRoles={['ADMIN']} />}>
        <Route path='/admin' element={<PageAdmin />} />
      </Route>

      <Route path='/about' element={<PageAbout />} />

      <Route
        path='/conditional'
        element={
          <ConditionalRoute isAllowed={true} redirectPath='/'>
            <div className='w-screen'>
              <h1 className='py-6 text-center font-black text-blue-500'>
                Conditional Routing Example
              </h1>
              <p className='text-center'>
                This page is only shown based on the value of{' '}
                <code>isAllowed</code>.
              </p>
            </div>
          </ConditionalRoute>
        }
      />

      {/* Conditional routing can also be inlined by using a ternary such that:
      element={ condition ? <SomeComponent /> : <Navigate to='/' replace />} */}

      <Route
        path='/inline-conditional'
        element={
          condition ? (
            <div className='w-screen'>
              <h1 className='py-6 text-center font-black text-blue-500'>
                Inlined Conditional Routing Example
              </h1>
            </div>
          ) : (
            <Navigate to='/' replace />
          )
        }
      />

      <Route path='/error-demo' element={<PageErrorDemo />} />

      <Route path='/unauthorized' element={<PageUnauthorized />} />
      <Route path='*' element={<PageNotFound />} />
    </Route>

    <Route
      path='/outlier'
      element={
        <div className='w-screen'>
          <h1 className='py-6 text-center font-black text-blue-500'>Outlier</h1>
          <p className='text-center'>
            This content exists outside of <code>MainLayout</code>.
          </p>
        </div>
      }
    />
  </Route>
)
