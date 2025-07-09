// Third-party imports
import { ComponentProps, forwardRef } from 'react'

// Custom imports
import { useAccordionItemContext, useAccordionContext } from './contexts'
import { Collapse } from '../Collapse'
import { twMerge } from 'tailwind-merge'

interface IAccordionContent extends ComponentProps<'div'> {
  duration?: number
}

// Do not add padding here!
const contentClassName = `
  overflow-hidden
  bg-stone-50
  text-base
  shadow-[inset_0px_1px_0px_theme(colors.stone.300)]
`

/* ========================================================================
                                AccordionContent
======================================================================== */
// Gotcha: If you need padding on your content, wrap the conent in a <div>
// in the consuming code. Padding applied directly to the top-level Collapse
// <div> breaks the fluidity of the collapse effect. Consequently, padding:0
// has been hardcoded into the Collapse itself.

export const AccordionContent = forwardRef<HTMLDivElement, IAccordionContent>(
  (
    {
      children,
      className = '', // Do not add padding here.
      duration: localDuration,
      style = {}, // Do not add padding here.
      ...otherProps
    },
    ref
  ) => {
    /* ======================
          state & refs
    ====================== */
    const { value: itemKey } = useAccordionItemContext()
    const {
      activeItems,
      disableTransition,
      duration: globalDuration
    } = useAccordionContext()

    const duration =
      typeof localDuration === 'number' ? localDuration : globalDuration

    /* ======================
            return
    ====================== */

    return (
      <Collapse
        className={twMerge(contentClassName, className)}
        disableTransition={disableTransition}
        duration={duration}
        isOpen={activeItems.includes(itemKey)}
        style={style}
        {...otherProps}
        // ref seems to need to go after otherProps in this case
        // because of the way the Collapse's forwardRef is typed.
        ref={ref}
      >
        {children}
      </Collapse>
    )
  }
)
