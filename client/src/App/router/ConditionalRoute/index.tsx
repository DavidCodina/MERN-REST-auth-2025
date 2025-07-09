import { JSX } from 'react'
import { Navigate } from 'react-router'

interface IConditionalRoute {
  children: JSX.Element
  isAllowed: boolean
  redirectPath: string
}

/* ========================================================================
                              ConditionalRoute
======================================================================== */
// Initially, this was called PrivateRoute, but calling it ConditionalRoute is
// more generic. That said, we may also want a PrivateRoute component that instead
// of passing in isAllowed from the outside, actually handles the isAllowed logic
// internally (e.g., checks global state, context or localStorage for user permissions).

export const ConditionalRoute = ({
  children,
  isAllowed,
  redirectPath = '/'
}: IConditionalRoute): JSX.Element => {
  if (isAllowed) {
    return children
  }
  // <Navigate /> can also take in state={{ }} prop.
  return <Navigate to={redirectPath} replace />
}
