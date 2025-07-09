import { Fragment } from 'react'
import { UncontrolledModal } from './UncontrolledModal'

/* ========================================================================
                        RadixUncontrolledModalDemo
======================================================================== */

export const RadixUncontrolledModalDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <UncontrolledModal
        trigger={
          <button
            className='btn-sky btn-sm mx-auto mb-6 block'
            style={{ minWidth: 150 }}
          >
            Open Uncontrolled Modal
          </button>
        }
      />
    </Fragment>
  )
}
