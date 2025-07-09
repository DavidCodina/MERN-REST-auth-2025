import { Fragment, useEffect, useState } from 'react'

///////////////////////////////////////////////////////////////////////////
//
// The basic implementation for idle detection in react-idle-timer can be found here:
// https://idletimer.dev/docs/features/idle-detection
//
// The implementation for the confirm prompt can be found here:
// https://idletimer.dev/docs/features/confirm-prompt
//
// This demo does not implement cross-tab support, but details can be found here:
// https://idletimer.dev/docs/features/cross-tab
//
// The nice thing about this session timeout strategy is that it's independent
// from the JWT expiration. It assumes that a user will at some point become
// idle prior to the access token actually expiring. Thus there's no need
// to actually track if/when the token expires from the client.
//
///////////////////////////////////////////////////////////////////////////
import { useIdleTimer } from 'react-idle-timer'

import { useAuthContext } from 'contexts'
import { ModalSessionTimeout } from './ModalSessionTimeout'

const timeout = 60 * 1000 * 60 // Demo only.
const promptBeforeIdle = 15 * 1000 // Demo only

/* ========================================================================
                              IdleTimer
======================================================================== */
// Initially, all this logic was directly within MainLayout. The problem
// with that is it would cause MainLayout AND ALL CHILDREN to then rerender
// every second.

export const IdleTimer = () => {
  const { isAuthenticated, logOut } = useAuthContext()
  const [showModal, setShowModal] = useState<boolean>(false)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: timerState, count, and remaining are values derived from the internal
  // state of react-idle-timer. In other words, they are superficial and DO NOT
  // control or influece the internal state of react-idle-timer.
  //
  /////////////////////////
  //
  // Why 'active' initially even though it doesn't start until user logs in?
  // If we deconstruct isIdle() and call it, it returns false. Presumably, this
  // implies that 'active' is react-idle-timer's default internal state even when
  // not yet started. That said, it makes more sense conceptually for it to be 'idle'
  // if the timer is unstarted / paused. Here, it's left 'active', but actually
  // the useEffect below calls pause() on mount when !isAuthentciated, so timerState
  // will immediatley get updated to 'idle'.
  //
  ///////////////////////////////////////////////////////////////////////////
  const [timerState, setTimerState] = useState<string>('active') // Demo only
  const [count, setCount] = useState<number>(0) // Demo only

  const [remaining, setRemaining] = useState<number>(0) // Used in ModalSessionTimeout

  /* ======================

  ====================== */

  const onIdle = () => {
    setTimerState('idle')
    setShowModal(false)

    if (isAuthenticated) {
      logOut()
    }
  }

  // Called when:
  // { type: 'active', prompted: true } --> { type: 'active', prompted: false }
  // { type: 'idle' }                   --> { type: 'active', prompted: false }
  const onActive = () => {
    setTimerState('active')
    setShowModal(false)
  }

  const onAction = () => {
    setCount((v) => v + 1)
  }

  const onPrompt = () => {
    setTimerState('prompted')
    setShowModal(true)
  }

  const { start, pause, getRemainingTime, activate } = useIdleTimer({
    ///////////////////////////////////////////////////////////////////////////
    //
    // Gotcha: When react-idle-timer is in it's INTERNAL prompted state
    // (i.e. presence: {type: 'active', prompted: true}), then no events are registered.
    //
    // This means if the timer started automatically on mount and the user logs in at that point,
    // then they will be logged out within seconds. Solution: Rather than starting automatically
    // on mount, we only want to start the timer once isAuthenticated. See useEffect's below.
    //
    // An alternate solution to implementing useEffects would be to create an <IdleTimer />
    // abstraction that was actually mounted/unmounted here: { isAuthenticated && <IdleTimer /> }.
    // This might actually be a cleaner solution since it abstracts away the timer functionality
    // into a separate component.
    //
    ///////////////////////////////////////////////////////////////////////////
    startManually: true,
    onIdle,
    onActive,
    onAction,
    onPrompt,
    // https://idletimer.dev/docs/api/props#onpresencechange
    // onPresenceChange: (presence) => { console.log('The presence changed: ', presence) },
    timeout,
    promptBeforeIdle,
    throttle: 500
  })

  const handleContinueSession = () => {
    activate()
  }

  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0) // Demo only

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() updates local remaining state - time until react-idle-timer's
  // internal presence becomes: { type: 'idle' }. react-idle-timer's INTERNAL 'idle'
  // state can be derived by using it's getRemainingTime() method.
  //
  // Presmuably, getRemainingTime() is related to logic that watches
  // events internally. The docs specifically implement a useEffect()
  // with no dependency array. Thus, this ends up getting called a lot.
  //
  // It's job is to simply reset the local remaining state. The remaining
  // state is merely a convenience feature. We can remove it, and this useEffect()
  // and react-idle-timer would still work fine. That said, remaining is used
  // with in the ModalSessionTimeout to show how many seconds are left. Thus,
  // it's still good to track remaining.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  /* ======================
          useEffect()
  ====================== */
  // When isAuthenticated goes from false to true, start() react-idle-timer.

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    start()

    // Update the 'superficial' state (used for demo).
    setTimerState('active')
    // console.log('start() called.')
  }, [isAuthenticated, start])

  // Gotcha: When logging out we need to STOP the timer. I thought calling
  // reset() in a separate useEffect() would solve this. However, reset()
  // seems to implicitly start() the timer again, which is not what we want.
  // There is no actual stop(). What we actually want is pause().
  useEffect(() => {
    if (isAuthenticated) {
      return
    }

    // This pauses the IdleTimer instance. When paused all events are unbound.
    pause()

    // To reflect that all events are unbound, we can also reset our 'superficial' state.
    setTimerState('idle')
    setCount(0)
    setRemaining(0)
    // console.log('pause() called.')
  }, [isAuthenticated, pause])

  /* ======================
    renderIdleTimerInfo()
  ====================== */
  // This is a demo section that shows various state related to react-idle-timer.

  const renderIdleTimerInfo = () => {
    if (import.meta.env.DEV === true) {
      return (
        <section
          className='border border-indigo-800'
          style={{
            backgroundColor: '#fff',
            // border: '2px solid #333',
            borderRadius: 10,
            fontSize: 12,
            padding: 10,
            position: 'absolute',
            top: 10,
            left: 10,
            minWidth: 200,
            transform: 'scale(0.65)',
            transformOrigin: 'top left',
            zIndex: 1000
          }}
        >
          <h6 className='mb-1 text-center font-bold text-blue-500'>
            Idle Timer Info
          </h6>
          <div className='flex justify-between'>
            <strong>Current State: </strong>
            <span>{timerState}</span>
          </div>

          <div className='flex justify-between'>
            <strong>Logout prompt in:</strong>
            <span>{timerState === 'idle' ? 0 : timeTillPrompt}</span>
          </div>

          <div className='flex justify-between'>
            <strong>Action Events:</strong>
            <span>{count}</span>
          </div>
          <div className='flex justify-between'>
            <strong>Seconds until idle:</strong>
            <span>{timerState === 'idle' ? 0 : remaining}</span>
          </div>
        </section>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      {renderIdleTimerInfo()}

      <ModalSessionTimeout
        handleContinueSession={handleContinueSession}
        onClose={() => setShowModal(false)}
        remaining={remaining}
        show={showModal}
      />
    </Fragment>
  )
}
