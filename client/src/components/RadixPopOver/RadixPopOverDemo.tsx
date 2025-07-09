import { Fragment } from 'react'
import { RadixPopOver } from './'

/* ========================================================================
                                RadixPopOverDemo
======================================================================== */

export const RadixPopOverDemo = () => {
  /* ======================
          return
  ====================== */
  return (
    <Fragment>
      <RadixPopOver
        // px-1 py-1
        contentClassName={`
        [--radix-popover-border-color:#409]
        [--radix-popover-close-color:theme(colors.sky.500)]
        [--radix-popover-close-hover-color:#409]
        [--radix-popover-close-position:1px]
        `}
        trigger={
          <button
            className='mx-auto block rounded-full text-blue-500'
            onClick={() => {
              console.log('Clicked')
            }}
          >
            <span className='sr-only'>Information</span>
            <svg
              style={{ height: '2rem' }}
              fill='currentColor'
              viewBox='0 -960 960 960'
            >
              <path d='M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z' />
            </svg>
          </button>
        }
        // trigger={
        //   <button
        //     className='btn-green btn-sm mx-auto block min-w-[150px]'
        //     onClick={() => {
        //       console.log('Clicked')
        //     }}
        //   >
        //     Click Me
        //   </button>
        // }

        // closeButton={false}
        contentStyle={{
          maxWidth: 'clamp(0px, 250px, calc(100vw - 20px))'
          // Or use: maxWidth: RadixPopOver.clampMaxWidthToViewport(250, 10)
        }}
        // defaultOpen
        // side='right'
        sideOffset={0}

        // arrow={false}
      >
        {/* <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          asperiores fugiat aliquam obcaecati deleniti animi eius quo ipsum.
          Modi facilis consectetur quo porro atque, fuga veniam. Quia minus
          obcaecati praesentium consequuntur accusantium ab magni? Impedit
          fugiat totam inventore quidem quisquam aspernatur reiciendis nesciunt
          at ipsum temporibus! Impedit deleniti esse blanditiis provident
          aperiam architecto suscipit! Veniam eius voluptatibus molestias esse
          vel a corrupti voluptatem ab numquam natus explicabo ipsum accusantium
          tempora, dicta et dolor doloremque hic vero nesciunt similique? Sequi
          voluptates, recusandae impedit animi temporibus odio fuga eum,
          corporis qui natus corrupti deleniti. Fugiat quasi, hic blanditiis sed
          accusamus provident molestias.
        </div> */}

        {/* <div className=''>
          <input className='form-control form-control-sm mb-2' />
          <input className='form-control form-control-sm mb-2' />
        </div> */}

        <div className='flex items-center gap-1'>
          <span className='text-4xl'>😃</span>
          <span>
            Yay! It worked! This content is very long, but that's okay because
            you're a genius at styling.
          </span>
        </div>
      </RadixPopOver>

      <button
        className='btn-blue btn-sm mx-auto my-6 block min-w-[150px]'
        onClick={() => {
          console.log('Clicked')
        }}
      >
        Random Button
      </button>
    </Fragment>
  )
}
