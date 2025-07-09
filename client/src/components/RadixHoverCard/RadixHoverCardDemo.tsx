import { Fragment } from 'react'
import { RadixHoverCard } from './'

/* ========================================================================
                                RadixHoverCardDemo
======================================================================== */

export const RadixHoverCardDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <RadixHoverCard />

      <button
        className='btn-blue btn-sm mx-auto my-6 block min-w-[150px]'
        onClick={() => {
          console.log('Clicked')
        }}
      >
        Random Button
      </button>
    </Fragment>
  )
}
