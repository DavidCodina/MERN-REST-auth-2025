// Third-party imports
import { ComponentProps, useEffect, forwardRef } from 'react'

// Custom imports
import { useAccordionItemContext, AccordionItemProvider } from './contexts'
import { twMerge } from 'tailwind-merge'

interface IAccordionItem extends ComponentProps<'div'> {
  value: string
}

// 'overflow-hidden' helps prevent the borders of <AccordionTrigger> &
// <AccordionContent> from edging out. However, it's possible that this
// could lead to issues if/when an AccordionItem has dropdown, dropdown select, etc.
const itemClassName = `
  relative mt-[1px]
  overflow-hidden
  first:mt-0
  first:rounded-tl-[inherit]
  first:rounded-tr-[inherit]
  last:rounded-bl-[inherit]
  last:rounded-br-[inherit]
  focus-within:z-[1]
  focus-within:shadow-[0px_0px_0px_1px_theme(colors.blue.500)]
`

/* ========================================================================
                                AccordionItem
======================================================================== */

const AccordionItem = forwardRef<HTMLDivElement, IAccordionItem>(
  ({ children, className = '', style = {}, value, ...otherProps }, ref) => {
    const { setValue } = useAccordionItemContext()

    /* ======================
        useEffect()
  ====================== */
    // When the AccordionItem mount, set it's value prop in the associated
    // AccordionItemContext. This then allows AccordionTrigger & AccordionContent
    // to also access that value...

    useEffect(() => {
      setValue(value)
    }, [value, setValue])

    /* ======================
          return
  ====================== */

    return (
      <div
        className={twMerge(itemClassName, className)}
        ref={ref}
        style={style}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

/* ========================================================================
                          AccordionItemWithContext
======================================================================== */

const AccordionItemWithContext = forwardRef<HTMLDivElement, IAccordionItem>(
  (props, ref) => {
    return (
      <AccordionItemProvider>
        <AccordionItem {...props} ref={ref} />
      </AccordionItemProvider>
    )
  }
)

export { AccordionItemWithContext as AccordionItem }
