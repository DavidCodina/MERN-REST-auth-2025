import { Fragment } from 'react'
import { RadixToolTip } from './'

/* ========================================================================
                                RadixToolTipDemo
======================================================================== */

export const RadixToolTipDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <RadixToolTip
        delayDuration={0}
        // defaultOpen
        trigger={
          <button
            className='btn-green btn-sm mx-auto mb-6 block'
            onClick={() => {
              console.log('Clicked')
            }}
          >
            Hover Me!
          </button>
        }
        contentClassName={`[--radix-tooltip-border-color:#409] [--radix-tooltip-bg-color:snow]`}
        contentStyle={{
          maxWidth: 'clamp(0px, 250px, calc(100vw - 20px))' // Or use: RadixToolTip.clampMaxWidthToViewport(250, 10)
        }}
        // arrow={false}
        // side='right'
        closeOnClick={true}
        toggleForceMount
        sideOffset={5}
      >
        {/* 
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            asperiores fugiat aliquam obcaecati deleniti animi eius quo ipsum.
            Modi facilis consectetur quo porro atque, fuga veniam. Quia minus
            obcaecati praesentium consequuntur accusantium ab magni? Impedit
            fugiat totam inventore quidem quisquam aspernatur reiciendis
            nesciunt at ipsum temporibus! Impedit deleniti esse blanditiis
            provident aperiam architecto suscipit! Veniam eius voluptatibus
            molestias esse vel a corrupti voluptatem ab numquam natus explicabo
            ipsum accusantium tempora, dicta et dolor doloremque hic vero
            nesciunt similique? Sequi voluptates, recusandae impedit animi
            temporibus odio fuga eum, corporis qui natus corrupti deleniti.
            Fugiat quasi, hic blanditiis sed accusamus provident molestias.
          </div>
        */}
        <div className='flex items-center gap-1'>
          <span className='text-4xl'>😃</span>
          <span>
            Yay! It worked! This content is very long, but that's okay because
            you're a genius at styling.
          </span>
        </div>
      </RadixToolTip>

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
