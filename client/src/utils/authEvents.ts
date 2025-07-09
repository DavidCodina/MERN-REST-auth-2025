type AuthEvent = 'AUTH_FAILURE' // Possibly change to 'SESSION_EXPIRED'

type Listener = () => void

const listeners: Record<AuthEvent, Listener[]> = {
  AUTH_FAILURE: []
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is a custom event emitter. This is essentially a simplified version
// of what libraries like EventEmitter3, Mitt, or Nanoevents provide.
//
// - No need for the native Event API, mainly because we don't need to pass
//  any additional data (i.e., using event.detail with native events).
//  The native Event API would be overkill here since we're not dealing with DOM interactions.
//
//   https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
//
///////////////////////////////////////////////////////////////////////////

export const authEvents = {
  on: (event: AuthEvent, listener: Listener) => {
    listeners[event].push(listener)
  },
  off: (event: AuthEvent, listener: Listener) => {
    listeners[event] = listeners[event].filter((l) => l !== listener)
  },
  emit: (event: AuthEvent) => {
    listeners[event].forEach((listener) => listener())
  }
}
