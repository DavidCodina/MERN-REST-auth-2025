import { Fragment, useState } from 'react'
import { UserModal } from './UserModal'

/* ========================================================================
                        RadixControlledModalDemo
======================================================================== */
// Conceptualize this component as if it were a Page component. Then we
// have a UserModal, which is a custom instance of RadixModal, which is
// itself a custom wrapper around Radix's Dialog.

export const RadixControlledModalDemo = () => {
  const [open, setOpen] = useState(false)

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <UserModal
        open={open}
        setOpen={setOpen}
        trigger={
          <button
            className='btn-sky btn-sm mx-auto mb-6 block'
            style={{ minWidth: 150 }}
          >
            Open Modal
          </button>
        }
      />
    </Fragment>
  )
}
