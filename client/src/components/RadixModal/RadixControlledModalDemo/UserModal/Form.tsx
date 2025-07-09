import { useState, useEffect } from 'react'
import { RadixModal } from '../../.'
import { Button } from '../../../Button'
import { sleep } from 'utils'

interface IForm {
  onSubmitted: () => void
}

/* ========================================================================
                                    Form
======================================================================== */

export const Form = ({ onSubmitted }: IForm) => {
  const [pending, setPending] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('Form mounted.')
    return () => {
      console.log('Form unmounted.')
    }
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='firstName'>
          First Name:
        </label>
        <input
          autoComplete='off'
          className='form-control form-control-sm'
          id='firstName'
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value)
          }}
        />
      </div>
      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='lastName'>
          Last Name:
        </label>
        <input
          autoComplete='off'
          className='form-control form-control-sm'
          id='lastName'
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value)
          }}
        />
      </div>

      <div className='mt-6 flex justify-end gap-2'>
        {/* Use RadixModal.Close for the synchronous closing. */}
        <RadixModal.Close asChild>
          <button className='btn-red btn-sm min-w-[100px]' type='button'>
            Cancel
          </button>
        </RadixModal.Close>

        <Button
          className='btn-green btn-sm min-w-[100px]'
          onClick={async () => {
            setPending(true)
            await sleep(3000)
            setPending(false)
            onSubmitted?.()
          }}
          loading={pending}
          loadingClassName='mr-1'
          type='button'
        >
          {pending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
