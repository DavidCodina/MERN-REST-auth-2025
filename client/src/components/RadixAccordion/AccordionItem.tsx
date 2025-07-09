// Third-party imports
import { ComponentProps, forwardRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

type AccordionItemProps = ComponentProps<typeof Accordion.Item>

/* ========================================================================
                              AccordionItem
======================================================================== */
// Initially, I thought of baking <AccordionTrigger> & <AccordionContent>
// into AccordionItem. However, it's much more flexible if they are standalone,
// so that they can be styled in the consuming enviroment.

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    { children, className = '', style = {}, value, ...otherProps },
    forwardedRef
  ) => {
    /* ======================
          return
  ====================== */

    return (
      <Accordion.Item
        className={`radix-accordion-item${className ? ` ${className}` : ''}`}
        ref={forwardedRef}
        style={style}
        value={value}
        {...otherProps} // disabled, etc.
      >
        {children}
      </Accordion.Item>
    )
  }
)
