import { ComponentProps, forwardRef, JSX } from 'react'
import { RadixModal } from '../../'
import { Form } from './Form'

interface IUserModal {
  // Optional in RadixModal, but required in the UserModal instance.
  open: boolean
  // Optional in RadixModal, but required in the UserModal instance.
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  // Optional in RadixModal, but required in the UserModal instance.
  trigger: JSX.Element
}

type CustomCloseButtonRef = HTMLButtonElement
type CustomCloseButtonProps = ComponentProps<'button'>

// eslint-disable-next-line
const CustomCloseButton = forwardRef<
  CustomCloseButtonRef,
  CustomCloseButtonProps
>((props) => {
  return (
    <button className='radix-modal-close-button' aria-label='Close' {...props}>
      <span className='sr-only'>Close</span>
      <svg style={{ height: '1.5em' }} fill='currentColor' viewBox='0 0 16 16'>
        <path d='M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z' />
        <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' />
      </svg>
    </button>
  )
})

/* ========================================================================
                                UserModal
======================================================================== */

export const UserModal = ({ open, setOpen, trigger }: IUserModal) => {
  /* ======================
          return
  ====================== */

  return (
    <RadixModal
      // You almost always want to use the trigger prop over an external/programmatic trigger.
      // Why? Because the button is implemented with Radix's Trigger, then by default focus will go
      // back to the trigger element when the dialog/modal is closed. This is not true if one was
      // using some random programmatic button.
      trigger={trigger}
      title='Edit User Info'
      titleClassName='text-blue-500'
      description='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, eligendi.'
      descriptionClassName='text-sm'
      open={open}
      setOpen={setOpen}
      // closeButton={<CustomCloseButton style={{}} />}
    >
      {/* In general, any content that manages some state should abstracted into its own component.
      That way when the Modal closes, the content's state will be reset when unmounted.
      This point is emphasized in the following Sam Selikoff tutorial at 12:30 :
      https://www.youtube.com/watch?v=3ijyZllWBwU 
      
      Conversely, if you want the state to persist (e.g., a modal that shows API data that rarely changes).
      Then implement the state directly within this component. */}
      <Form
        onSubmitted={() => {
          setOpen(false)
        }}
      />
    </RadixModal>
  )
}
