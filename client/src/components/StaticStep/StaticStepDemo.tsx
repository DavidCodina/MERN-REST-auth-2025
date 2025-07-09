'use client'
import type { ReactNode } from 'react'
import { cn } from 'utils'

import { StaticStep } from './'

const dataSteps = [
  {
    title: 'Step 1:',
    code: 'npx create-react-app my-app'
  },
  {
    title: 'Step 2:',
    code: 'cd my-app'
  },
  {
    title: 'Step 3:',
    code: 'npm start'
  },
  {
    title: 'Step 4:',
    code: 'npm run build'
  }
]

/* =============================================================================
                                
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//

//
////////////////////////////////////////////////////////////////////////////////

export const StaticStepDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <div className='mx-auto mb-6 max-w-[800px] rounded-xl border border-neutral-400 bg-white p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      {dataSteps.map((step, index) => (
        <StaticStep key={step.title} step={index + 1} title={step.title}>
          <CodeContainer>{step.code}</CodeContainer>
        </StaticStep>
      ))}
    </div>
  )
}

/* =============================================================================
                                
============================================================================= */

export const CodeContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-fit w-full rounded-lg border border-neutral-400 bg-neutral-100 px-5 py-2 transition-colors duration-300 dark:border-neutral-400/10 dark:bg-neutral-800 dark:hover:bg-neutral-800/80'>
      <code
        className={cn(
          'text-sm whitespace-pre-wrap text-neutral-500 dark:text-neutral-300'
        )}
      >
        {children}
      </code>
    </div>
  )
}
