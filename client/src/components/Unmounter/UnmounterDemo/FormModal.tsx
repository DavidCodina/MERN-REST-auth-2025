import { useState } from 'react'
import { Modal } from './Modal'

/* ========================================================================
                                FormModal
======================================================================== */

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
}

export const FormModal = ({ isOpen, onClose }: FormModalProps) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const formModalOnClose = () => {
    console.log({ firstName, lastName })
    onClose?.()
  }

  /* ======================
          return
  ====================== */

  return (
    <Modal
      style={{
        width: 600,
        maxWidth: '100vw'
      }}
      isOpen={isOpen}
      onClose={formModalOnClose}
      title={'User Information'}
    >
      <form autoComplete='off'>
        <div className='mb-6'>
          <label
            className='text-sm font-bold text-blue-500'
            htmlFor='firstName'
          >
            First Name
          </label>
          <input
            autoComplete='off'
            className='form-control form-control-sm'
            name='firstName'
            spellCheck={false}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className='text-sm font-bold text-blue-500' htmlFor='lastName'>
            Last Name
          </label>
          <input
            autoComplete='off'
            className='form-control form-control-sm'
            name='lastName'
            spellCheck={false}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  )
}
