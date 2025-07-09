// import { twMerge } from 'tailwind.config'

// Custom imports...

interface IModalCloseButton {
  onClick: (e?: React.MouseEvent<Element, MouseEvent> | undefined) => void
}

/* ========================================================================
                              ModalCloseButton
======================================================================== */

export const ModalCloseButton = ({ onClick }: IModalCloseButton) => {
  const handleModalClose = () => {
    if (typeof onClick === 'function') {
      onClick?.()
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <svg
      // https://heroicons.com/
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2.5}
      stroke='currentColor'
      //! Too many rings...
      className={`block h-7 w-7 cursor-pointer opacity-50 hover:text-blue-500 hover:opacity-100 dark:opacity-75 dark:hover:text-(--dark-primary-color) dark:hover:opacity-100`}
      onClick={handleModalClose}
      role='button'
      tabIndex={0}
      style={{
        position: 'absolute',
        right: 5,
        top: 5,
        // .modal-header has z-index: 1, so this just needs to beat that.
        zIndex: 10
      }}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  )
}
