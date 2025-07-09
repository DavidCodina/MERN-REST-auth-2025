import './Modal.css'
import * as React from 'react'
import { ReactNode, useEffect, useRef, JSX } from 'react'
import { createPortal } from 'react-dom'

/* ========================================================================

======================================================================== */

function PortalImplementation({
  onClose,
  children,
  title,
  closeOnClickOutside
}: {
  children: ReactNode
  closeOnClickOutside: boolean
  onClose: () => void
  title: string
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus()
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null

    const handler = (event: KeyboardEvent) => {
      // ❌ if (event.keyCode === 27) { ... }
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target
      if (
        modalRef.current !== null &&
        !modalRef.current.contains(target as Node) &&
        closeOnClickOutside
      ) {
        onClose()
      }
    }

    const modalElement = modalRef.current
    if (modalElement !== null) {
      modalOverlayElement = modalElement.parentElement
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutsideHandler)
      }
    }

    //^ This might not work in Next.js
    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler)
      }
    }
  }, [closeOnClickOutside, onClose])

  /* ======================
          return
  ====================== */

  return (
    <div className='rte-modal-overlay' role='dialog'>
      <div className='rte-modal' tabIndex={-1} ref={modalRef}>
        <h5 className='rte-modal-title'>{title}</h5>

        <button
          className='rte-modal-close-button'
          aria-label='Close modal'
          onClick={onClose}
          type='button'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z' />
          </svg>
        </button>
        <div className='rte-modal-content'>{children}</div>
      </div>
    </div>
  )
}

/* ========================================================================

======================================================================== */

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false
}: {
  children: ReactNode
  closeOnClickOutside?: boolean
  onClose: () => void
  title: string
}): JSX.Element {
  return createPortal(
    <PortalImplementation
      closeOnClickOutside={closeOnClickOutside}
      onClose={onClose}
      title={title}
    >
      {children}
    </PortalImplementation>,
    document.body
  )
}
