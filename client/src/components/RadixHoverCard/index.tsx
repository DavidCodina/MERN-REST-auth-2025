// Third-party imports
// import { useState, useRef } from 'react'
import * as HoverCard from '@radix-ui/react-hover-card'

/* ========================================================================
                                RadixHoverCard
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/components/hover-card
// For sighted users to preview content available behind a link.
//
// What is this? It's a link that shows a content preview.
// That's it! As such, it's a very niche use case.
// If what you want is to show a bunch of content on click
// then use a popover.
//
// I've decided not to build this any further as I will likely not be using it.
//
///////////////////////////////////////////////////////////////////////////

const RadixHoverCard = (_props: any) => {
  /* ======================
          return
  ====================== */

  return (
    <div className='flex justify-center'>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <a
            className='inline-block cursor-pointer rounded-full'
            href='https://twitter.com/radix_ui'
            target='_blank'
            rel='noreferrer noopener'
          >
            <img
              className='block h-[45px] w-[45px] rounded-full'
              src='https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png'
              alt='Radix UI'
            />
          </a>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            className='data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all'
            sideOffset={5}
          >
            <div className='flex flex-col gap-[7px]'>
              <img
                className='block h-[60px] w-[60px] rounded-full'
                src='https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png'
                alt='Radix UI'
              />
              <div className='flex flex-col gap-[15px]'>
                <div>
                  <div className='text-mauve12 m-0 text-[15px] leading-[1.5] font-medium'>
                    Radix
                  </div>
                  <div className='text-mauve10 m-0 text-[15px] leading-[1.5]'>
                    @radix_ui
                  </div>
                </div>
                <div className='text-mauve12 m-0 text-[15px] leading-[1.5]'>
                  Components, icons, colors, and templates for building
                  high-quality, accessible UI. Free and open-source.
                </div>
                <div className='flex gap-[15px]'>
                  <div className='flex gap-[5px]'>
                    <div className='text-mauve12 m-0 text-[15px] leading-[1.5] font-medium'>
                      0
                    </div>{' '}
                    <div className='text-mauve10 m-0 text-[15px] leading-[1.5]'>
                      Following
                    </div>
                  </div>
                  <div className='flex gap-[5px]'>
                    <div className='text-mauve12 m-0 text-[15px] leading-[1.5] font-medium'>
                      2,900
                    </div>{' '}
                    <div className='text-mauve10 m-0 text-[15px] leading-[1.5]'>
                      Followers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <HoverCard.Arrow className='fill-white' />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  )
}

// Note: the calc() string needs space between the minus symbol, which means
// that it will NOT work within a Tailwind arbitrary value.
const clampMaxWidthToViewport = (
  width: number,
  horizontalPadding: number = 10
) => {
  return `clamp(0px, ${width}px, calc(100vw - ${horizontalPadding * 2}px))`
}

const CompoundComponent = Object.assign(RadixHoverCard, {
  clampMaxWidthToViewport: clampMaxWidthToViewport
})

export { CompoundComponent as RadixHoverCard }
