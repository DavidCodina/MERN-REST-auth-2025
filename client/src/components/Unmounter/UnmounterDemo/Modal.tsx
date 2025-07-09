import { CSSProperties, ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
  style?: CSSProperties
  title: string
}

/* ========================================================================
                                Modal
======================================================================== */

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  style = {},
  className = ''
}: ModalProps) => {
  if (!isOpen) return null

  const header = (
    <div className='flex items-center justify-between border-b border-neutral-200 p-3'>
      <h3 className='m-0 text-xl leading-none font-bold text-blue-600'>
        {title}
      </h3>
    </div>
  )

  const body = <div className='p-6'>{children}</div>

  const footer = (
    <div className='flex items-center justify-end gap-2 border-t border-neutral-200 p-2'>
      <button
        onClick={onClose}
        className='min-w-[100px] rounded-lg border border-blue-700 bg-blue-500 px-2 py-1 text-sm font-bold text-white hover:bg-blue-600 focus:outline-none'
      >
        Close
      </button>
    </div>
  )

  const X = (
    <button
      onClick={onClose}
      className='absolute top-1 right-1 inline-flex items-center rounded-lg bg-transparent text-neutral-400 hover:text-blue-500'
    >
      <svg
        height='2em'
        width='2em'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
          clipRule='evenodd'
        ></path>
      </svg>
    </button>
  )

  /* ======================
          return
  ====================== */

  return (
    <div
      className='bg-opacity-50 fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black'
      style={{ zIndex: 9999 }}
    >
      <div
        className={`relative w-full p-4${className ? ` ${className}` : ''}`}
        style={style}
      >
        <div className='relative overflow-hidden rounded-lg border border-neutral-600 bg-[#fafafa] shadow'>
          {header}
          {body}
          {footer}
          {X}
        </div>
      </div>
    </div>
  )
}
