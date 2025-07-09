// Custom imports
import { Button, Modal, ModalBody } from 'components'
import { IModalSessionTimeout } from './types'

/* ========================================================================
                            ModalSessionTimeout
======================================================================== */

export const ModalSessionTimeout = ({
  handleContinueSession,
  onClose,
  remaining,
  show
}: IModalSessionTimeout) => {
  /* ======================
        handleClose()
  ====================== */

  const handleClose = () => {
    onClose?.()
  }

  /* ======================
      renderModalHeader()
  ====================== */

  const renderModalHeader = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          border: 'none',
          padding: '15px 0px 0px 0px',
          position: 'relative'
        }}
      >
        <h5
          className='text-center font-bold text-blue-500'
          style={{ flex: 1, lineHeight: 1 }}
        >
          Are you still there?
        </h5>
      </div>
    )
  }

  /* ======================
      renderModalBody()
  ====================== */

  const renderModalBody = () => {
    return (
      <ModalBody>
        <p className='mb-0 text-center text-sm'>
          Logging out in {remaining} seconds...
        </p>
      </ModalBody>
    )
  }

  /* ======================
    renderModalFooter()
  ====================== */

  const renderModalFooter = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
          paddingBottom: 15
        }}
      >
        <Button
          className='btn-blue btn-sm mx-auto block'
          onClick={handleContinueSession}
        >
          Continue Session
        </Button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Modal addCloseButton onClose={handleClose} show={show}>
      {renderModalHeader()}
      {renderModalBody()}
      {renderModalFooter()}
    </Modal>
  )
}
