import { useState } from 'react'
import { FormModal } from './FormModal'
import { Unmounter } from '../'

/* ========================================================================
                                UnmounterDemo
======================================================================== */

export const UnmounterDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  /* ======================
          return
  ====================== */

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className='mx-auto mb-6 block rounded bg-blue-500 px-2 py-1 text-sm font-bold text-white'
      >
        Open Modal
      </button>

      <Unmounter show={isOpen}>
        <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Unmounter>
    </div>
  )
}
