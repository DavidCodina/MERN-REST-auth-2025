// Third-party imports
import { ComponentProps, forwardRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

type AccordionContentProps = ComponentProps<typeof Accordion.Content>

/* ========================================================================
                            AccordionContent
======================================================================== */
// Gotcha: If you need padding on your content, wrap the content in a <div>
// in the consuming code. Otherwise, it will likely interfere with the collapse
// animation.

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className = '', style = {}, ...otherProps }, forwardedRef) => {
  return (
    <Accordion.Content
      className={`radix-accordion-content${className ? ` ${className}` : ''}`}
      ref={forwardedRef}
      style={style} // Do not add padding here.
      {...otherProps}
    >
      {children}
    </Accordion.Content>
  )
})
