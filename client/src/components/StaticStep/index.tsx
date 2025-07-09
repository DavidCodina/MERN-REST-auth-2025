'use client'
import type { ReactNode } from 'react'

/* =============================================================================
                                
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// https://www.eldoraui.site/docs/components/staticstepper
// https://github.com/karthikmudunuri/eldoraui/blob/main/registry/default/eldoraui/staticstepper.tsx
//
////////////////////////////////////////////////////////////////////////////////

export const StaticStep = ({
  step,
  title,
  children
}: {
  step: number
  title: string
  children?: ReactNode
}) => {
  return (
    <div className='flex gap-6'>
      <div className='flex flex-col items-center'>
        <p className='m-0 flex size-8 flex-none items-center justify-center rounded-full border border-neutral-400 bg-neutral-100 text-sm font-medium text-neutral-700 select-none dark:border-neutral-400/10 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80'>
          {step}
        </p>
        <div className='relative my-3 h-full w-px rounded-full bg-neutral-300 dark:bg-neutral-700' />
      </div>

      <div className='mb-4 w-full'>
        <h6 className='mb-4 ml-1 text-lg font-bold tracking-tight text-neutral-600 dark:text-neutral-50'>
          {title}
        </h6>
        {children}
      </div>
    </div>
  )
}
