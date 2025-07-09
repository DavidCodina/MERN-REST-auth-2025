// Third-party imports
import { ComponentProps, forwardRef } from 'react'

// Custom imports
import { useAccordionContext, useAccordionItemContext } from './contexts'
import { AccordionHeader } from './AccordionHeader'
import { twMerge } from 'tailwind-merge'

type AccordionTriggerProps = ComponentProps<'button'>

//# Work on the chevron part...
const triggerClassName =
  'flex flex-1 items-center justify-between bg-white p-[15px] leading-none hover:bg-stone-100 [&>.accordion-chevron]:data-[state=open]:rotate-180'

/* ========================================================================
                                AccordionTrigger
======================================================================== */
//# Add Chevron.

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className = '', children, style = {}, ...otherProps }, ref) => {
  const { updateActiveItems } = useAccordionContext()
  const { value } = useAccordionItemContext()

  /* ======================
          return
  ====================== */

  return (
    <AccordionHeader>
      <button
        className={twMerge(triggerClassName, className)}
        onClick={() => updateActiveItems(value)}
        ref={ref}
        style={style}
        {...otherProps}
      >
        {children}

        {/*
        <ChevronDownIcon
          className='accordion-chevron transition-transform duration-300'
          aria-hidden
        />
         */}
      </button>
    </AccordionHeader>
  )
})
