'use client'

import { useState } from 'react'
import { NativeDialog } from './'

/* ========================================================================

======================================================================== */

export const NativeDialogDemo = () => {
  // const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [show, setShow] = useState(false)

  /* ======================
          return
  ====================== */

  return (
    <>
      <button
        className='btn-blue btn-sm mx-auto mb-12 block'
        onClick={() => {
          setShow(true)
        }}
      >
        {show ? 'Close Dialog' : 'Open Dialog'}
      </button>

      <NativeDialog show={show}>
        <div
          className='flex flex-col rounded-lg border border-black bg-white p-4'
          style={{
            boxShadow: '0px 2px 6px rgba(0,0,0,0.35)',
            width: 600,
            height: 300
          }}
        >
          <div className='flex-1'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
              facilis qui ipsam at dolorum perferendis fuga harum. Repellendus
              rem quas voluptatum doloremque iste, facere molestiae sapiente
              ipsum at alias pariatur quia doloribus. Consequatur quo alias
              laudantium, veritatis quaerat beatae temporibus nisi illum quos
              odit fugit minima, cupiditate nostrum recusandae amet.
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className='btn-blue btn-sm mx-auto block min-w-[150px]'
          >
            Close
          </button>
        </div>
      </NativeDialog>
    </>
  )
}
