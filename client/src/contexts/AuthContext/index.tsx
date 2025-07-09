import * as React from 'react'
import { toast } from 'react-toastify'

import { authEvents } from 'utils'
import { getSession } from './getSession'
import { logoutUser } from './logoutUser'

import { Session } from 'types'

type AuthSuccessHandler = (session: Session) => void

type MaybeSession = Session | null

export type AuthContextValue = {
  session: MaybeSession
  sessionLoading: boolean
  isAuthenticated: boolean
  handleAuthSuccess: AuthSuccessHandler
  logOut: () => void
  isLoggingOut: boolean
}

export const AuthContext = React.createContext({} as AuthContextValue)
export const AuthConsumer = AuthContext.Consumer

type AuthProviderProps = {
  children: React.ReactNode
}

//* BroadcastChannel PART 1 : Create a BroadcastChannel for logout events.

///////////////////////////////////////////////////////////////////////////
//
// The BroadcastChannel API is a native browser API that allows communication between
// different browsing contexts (windows, tabs, iframes, or workers) on the same origin.
// BroadcastChannel has been widely available in all modern browsers since March 2022.
// It’s considered stable and production-ready for most use cases.
//
//   https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
//   https://developer.chrome.com/blog/broadcastchannel
//
// ⚠️ Browser Support: BroadcastChannel is supported in all modern browsers,
// but if you need to support older browsers, consider a localStorage fallback.
//
/////////////////////////
//
// Is Using BroadcastChannel for Login as Common as for Logout?
//
// It’s less common to use BroadcastChannel for login than for logout, but it’s not unheard of.
// It’s more of a “nice-to-have” than a “must-have” for most apps. Why is BroadcastChannel Essential for Logout?
//
//   - Security: If you log out in one tab, you want all tabs to immediately clear sensitive data and session state.
//     Otherwise, you risk leaving a tab “logged in” after the user thinks they’re out. That’s a big security and UX fail.
//
//   - Consistency: Prevents weirdness where some tabs are logged out and others aren’t.
//
/////////////////////////
//
// Do Modern Auth Libraries Use BroadcastChannel for Cross-Tab Logout?
//
// Most modern third-party auth libraries do NOT use the BroadcastChannel API directly for cross-tab logout.
// Instead, they typically rely on the storage event (via localStorage) for cross-tab communication, or they
// use their own custom mechanisms. The rationale to use the legacy approach is not necessarily because
// BroadcastChannel is a bad solution, but because auth libraries generally try to support older browsers
// for maximum compatibility.
//
///////////////////////////////////////////////////////////////////////////
const LOGOUT_CHANNEL = 'LOGOUT_CHANNEL'
const logoutChannel =
  typeof window !== 'undefined' ? new BroadcastChannel(LOGOUT_CHANNEL) : null

/* ========================================================================
                                AuthProvider
======================================================================== */
//# Possibly use `session.sessionExp` in the idle timer implmentation.

export const AuthProvider = ({ children }: AuthProviderProps) => {
  /* ======================
        state & refs
  ====================== */

  // isLoggingOut is read by <PrivateRoutes /> to conditionally apply/omit the redirect
  // search parameter such that when a user logs out, redirect="..." is NOT set if isLoggingOut.
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const [session, setSession] = React.useState<Session | null>(null)

  // ⚠️ Default value of true is crucial to PrivateRoutes.tsx behaving correctly on mount.
  // Otherwise, there'll be a brief instance where !sessionLoading and this results
  // in PrivateRoutes.tsx triggering: <Navigate to={`/login?redirect=${encodedRedirect}`} replace />
  // Once that's done, you're no longer in PrivateRoutes.tsx, which means it doesn't matter
  // if sessionLoading becomes true a millisecond later.

  const [sessionLoading, setSessionLoading] = React.useState(true)
  const isAuthenticated = session ? true : false

  /* ======================
          logOut()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Dead Backend:
  //
  // The server logoutUser resolver never throws an error.
  // It always returns { message: string, success: true }.
  // However, if the server is down you'll get cack a networkError.
  // It's also possible that the internet is down. Whatever the case,
  // if there's an error here, then we need to toast something to the user:
  //
  // Should we continue with client-side logout if the server never responds?
  // Yes, you should still proceed with the client-side logout. Why?
  // Because from the user's perspective, they hit "logout" and expect to be logged out,
  // regardless of server status. If you don't clear the client state, they might stay
  // "logged in" on the frontend, which is a security risk and a confusing UX.
  //
  // - Proceed with the client-side logout (clear cache, update state, etc.)
  // - Show a toast:
  //
  //   "You have been logged out locally, but the server could not be reached.
  //   If this device is shared, please ensure you are fully logged out later."
  //
  // This is both transparent and secure. It also helps users understand that something went wrong,
  // but they're safe on this device. If you don't log out on the client, the user is stuck in limbo.
  // That's a worse experience and a potential security issue.
  //
  // TL;DR
  //
  //   - Always clear client state on logout, even if the server is unreachable.
  //   - Show a toast if the server can't be reached, so the user knows what's up.
  //   - Never leave the user "logged in" on the client if they hit logout.
  //
  // All of the client-side logout logic still happend in logOut() below.
  // Thus, all we need to do here is create a toast notfiication.
  //
  ///////////////////////////////////////////////////////////////////////////

  const logOut = React.useCallback(async () => {
    const { success } = await logoutUser()

    if (success === true) {
      toast.success('Log out successful!')
    } else {
      toast.error(
        'You have been logged out locally, but the server could not be reached. If this device is shared, please ensure you are fully logged out later.',
        { autoClose: false }
      )
    }

    setIsLoggingOut(true)
    setSession(null)

    //* BroadcastChannel PART 2: On logout, post a message to the logoutChannel.
    logoutChannel?.postMessage('logout') // Notify other tabs

    setTimeout(() => {
      setIsLoggingOut(false)
    }, 1500)
  }, [])

  /* ======================
      handleAuthSuccess()
  ====================== */
  //# This seems kind of weird. Why not just expose setSession to login and register?

  const handleAuthSuccess: AuthSuccessHandler = (newSession) => {
    setSession(newSession)
  }

  /* ======================
        useEffect()
  ====================== */

  React.useLayoutEffect(() => {
    setSessionLoading(true)
    getSession()
      .then((result) => {
        const { success, data } = result

        if (success === true) {
          setSession(data)
        }
        return result
      })
      .catch((err) => err)
      .finally(() => {
        setSessionLoading(false)
      })
  }, [])

  /* ======================
        useEffect()
  ====================== */
  // Listen for a potentional 'AUTH_FAILURE' event, emitted by customFetch().
  // This event is emitted when the request to '/api/auth/refresh-token' fails.
  // By listening for it here, we can then log the user out automatically

  React.useEffect(() => {
    const handleAuthFailure = async () => {
      // This prevents the function from running on application mount.
      // Obviously, if the user is not logged in, there's no need to log them out.
      if (!session) {
        return
      }
      // Rather than calling logOut() here. It's better to create similar behavior,
      // but without setting isLoggingOut state to true, and without the specific toasts.

      const { success } = await logoutUser()

      if (success === true) {
        toast.success(
          'Whoops! The session expired. Please log back in to continue.'
        )
      } else {
        // This is somewhat unlikely. It's not a great user experience, but seems necessary nonetheless.
        toast.error(
          'The session expired. Please log back in to continue. However, the server could not be reached. If this device is shared, please ensure you are fully logged out later.',
          { autoClose: false }
        )
      }

      setSession(null)
      logoutChannel?.postMessage('logout') // Notify other tabs
    }

    authEvents.on('AUTH_FAILURE', handleAuthFailure)
    return () => authEvents.off('AUTH_FAILURE', handleAuthFailure)
  }, [session])

  /* ======================
        useEffect()
  ====================== */
  //* BroadcastChannel PART 3 : All tabs listen for the message and call setSession(null) when received.

  React.useEffect(() => {
    if (!logoutChannel) {
      return
    }

    // The event listener seems to be only called in non-primary tabs.
    // That’s expected behavior with BroadcastChannel.
    // The tab that posts the message does NOT receive its own message.
    // Only other tabs (listeners) receive the event.
    // This is by design, so you don’t double-handle the logout in the tab that initiated it.
    const handleLogoutChannelMessage = () => {
      setSession(null)
      // Not needed because setSession(null) will wipe session data, which will
      // then trigger PrivateRoutes to redirect if the current route is protected.
      // ❌ window.location.href = '/login'
    }

    // The 'message' event is a standard part of the BroadcastChannel spec.
    // When you call postMessage, all other tabs (except the sender) receive a 'message' event.
    // The event handler receives a MessageEvent object, which contains the data you sent.
    logoutChannel.addEventListener('message', handleLogoutChannelMessage)
    return () =>
      logoutChannel.removeEventListener('message', handleLogoutChannelMessage)
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <AuthContext.Provider
      value={{
        session,
        sessionLoading,
        isAuthenticated,
        handleAuthSuccess,
        logOut,
        isLoggingOut
      }}
    >
      {/* Arguably, one could defer rendering children until !sessionLoading,
      rather than handling similar logic in PrivateRoutes.tsx. However, that
      means there would always be null or some other loading UI on app mount.
      and that feels like bad UX. Instead, by giving that responsibility to 
      PrivateRoutes.tsx, initial loading UI ONLY shows when initially on a
      protected route:
      
        {sessionLoading ? null : children} 
      */}

      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const value = React.useContext(AuthContext)
  return value
}
