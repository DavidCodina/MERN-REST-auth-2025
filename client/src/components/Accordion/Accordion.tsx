// Third-party imports
import { ComponentProps, useEffect, useRef, forwardRef } from 'react'

// Custom imports
import { AccordionProvider } from './contexts'
import { twMerge } from 'tailwind-merge'
import { useAccordionContext } from './contexts'
import { AccordionItem } from './AccordionItem'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'

interface IAccordion extends ComponentProps<'div'> {
  collapsible?: boolean
  defaultValue?: string | string[]
  disableTransition?: boolean
  duration?: number
  type?: 'single' | 'multiple'
}

// 'bg-stone-500' works in conjnction with 'mt-[1px] first:mt-0' on <AccordionItem>.
const rootClassName = `border border-stone-300 bg-stone-300`

/* ========================================================================
                                  Accordion
======================================================================== */
// Inspired by https://www.radix-ui.com/primitives/docs/components/accordion.

//# Add a value (and maybe setValue) prop here that allows it to be controlled (Maybe)

//# Ultimately, add dark mode to both (make it localized).

//# My biggest concern with this component is how it handles dropdowns, comboboxes,
//# selects, dropdown datepickers, etc. Presumably, they would be concealed by the
//# overflow-hidden classes. That's the only major issue I have, but it would only
//# need a little fine-grained CSS tuning to fix up.

// Could do this in a useEffect, then cache it...
// Might caust peformance issues.
// https://javascript.info/modules-dynamic-imports
// const { twMerge: twMerge2 } = await import('tailwind.config')
// console.log('twMerge2:', twMerge2)

const Accordion = forwardRef<HTMLDivElement, IAccordion>(
  (
    {
      children,
      className = '',
      collapsible = true,
      duration = 300,
      defaultValue,
      disableTransition = false,
      style = {},
      type = 'single',
      ...otherProps
    },
    ref
  ) => {
    const {
      setCollapsible,
      setDefaultValue,
      setDuration,
      setDisableTransition,
      setType
    } = useAccordionContext()
    const firstRenderRef = useRef(true)

    /* ======================
         useEffect()
  ====================== */
    // The problem with defaultValue as an array is that it may change on every render.
    // One solution to prevent this internally would be to stringigy it, outside of
    // useEffect, then parse it inside of useEffect. However, in this case, we can just
    // use a firstRenderRef, which is also good because it protects against other possible
    // reruns.

    useEffect(() => {
      // We probably don't need a firstRenderRef, but just in case.
      if (firstRenderRef.current === false) {
        return
      }
      firstRenderRef.current = false

      if (defaultValue) {
        setDefaultValue(defaultValue)
      }

      if (typeof collapsible === 'boolean') {
        setCollapsible(collapsible)
      }

      setType(type)
      setDuration(duration)
      setDisableTransition(disableTransition)
    }, [
      collapsible,
      disableTransition,
      setDisableTransition,
      duration,
      setDuration,
      setCollapsible,
      defaultValue,
      setDefaultValue,
      setType,
      type
    ])

    /* ======================
          return
  ====================== */

    return (
      <div
        className={twMerge(rootClassName, className)}
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
                          AccordionWithProvider
======================================================================== */

const AccordionWithProvider = forwardRef<HTMLDivElement, IAccordion>(
  (props, ref) => {
    return (
      <AccordionProvider>
        <Accordion {...props} ref={ref} />
      </AccordionProvider>
    )
  }
)

///////////////////////////////////////////////////////////////////////////
//
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34757
// Once we wrap the component in forwardRef, it becomes more difficult
// to get Typescript to allow adding properties onto the component:
//
// ❌ AccordionWithProvider.Item === AccordionItem
// Property 'Item' does not exist on type ...
//
// Object.assign()  does not cause the same type issues as trying
// to append new properties. This is the way.
//
///////////////////////////////////////////////////////////////////////////

const CompoundComponent = Object.assign(AccordionWithProvider, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent
})

export { CompoundComponent as Accordion }

///////////////////////////////////////////////////////////////////////////

// Initially, I was prepending _ to AccordionWithProvider and doing this:
//
// Adding the child components to the Accordion with dot syntax becomes
// a little bit more tricky once Accordion/AccordionWithProvider are
// wrapped in forwardRef. In order to get Typescript to play along you
// have to do this kind of thing...
//
///////////////////////////////////////////////////////////////////////////

// interface IAccordionWithProvider
//   extends React.ForwardRefExoticComponent<
//     Omit<IAccordion, 'ref'> & React.RefAttributes<HTMLDivElement>
//   > {
//   // Gotcha: Here we don't actually want React.ComponentProps<typeof xxx>
//   Item: typeof AccordionItem
//   Trigger: typeof AccordionTrigger
//   Content: typeof AccordionContent
// }

// const AccordionWithProvider = _AccordionWithProvider as IAccordionWithProvider

// AccordionWithProvider.Item = AccordionItem
// AccordionWithProvider.Trigger = AccordionTrigger
// AccordionWithProvider.Content = AccordionContent

// export { AccordionWithProvider as Accordion }
