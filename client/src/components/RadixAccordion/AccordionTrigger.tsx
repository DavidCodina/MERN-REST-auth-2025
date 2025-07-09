// Third-party imports
import { ComponentProps, forwardRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

type AccordionTriggerProps = ComponentProps<'button'>

const chevronDownIcon = (
  <svg
    viewBox='0 0 15 15'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='radix-accordion-chevron'
    aria-hidden='true' // ???
  >
    <path
      d='M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z'
      fill='currentColor'
      fillRule='evenodd'
      clipRule='evenodd'
    ></path>
  </svg>
)

/* ========================================================================
                              AccordionTrigger
======================================================================== */
// We can potentially do away with the Accordion.Header entirely,
// but it's probably useful for accessibility.

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className = '', style = {}, ...otherProps }, forwardedRef) => {
  return (
    <Accordion.Header className='radix-accordion-header'>
      <Accordion.Trigger
        className={`radix-accordion-trigger${className ? ` ${className}` : ''}`}
        ref={forwardedRef}
        style={style}
        {...otherProps}
      >
        {children}
        {chevronDownIcon}
      </Accordion.Trigger>
    </Accordion.Header>
  )
})
