// Third-party imports
import { ComponentProps, forwardRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

// Custom imports
import { AccordionItem } from './AccordionItem'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'

///////////////////////////////////////////////////////////////////////////
//
// Use type instead:
//
//   An interface can only extend an object type or intersection
//   of object types with statically known members.
//   interface IAccordion extends React.ComponentProps<typeof RadixAccordion.Root> {}
//
///////////////////////////////////////////////////////////////////////////

type AccordionType = ComponentProps<typeof Accordion.Root>

/* ========================================================================
                              RadixAccordion
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/components/accordion
//
// This component gets a few things right that I may not have done in the
// other examples. First it uses reflection to create the Typescript types
// off of the original Radix types. In some cases the may be preferred.
// However, with other components I have intentionally limited the interface
// for more simplicity.
//
// The other thing that is kind of nice is that the compound component
// children are abstracted into their own components with sensible default
// styles baked in -something I may also want to do with the RadixDropdown.
//
// See here for keyboard interactions:
//
//   https://www.radix-ui.com/primitives/docs/components/accordion#accessibility
//
///////////////////////////////////////////////////////////////////////////

const RadixAccordion = forwardRef<HTMLDivElement, AccordionType>(
  ({ children, className = '', style = {}, ...otherProps }, forwardedRef) => {
    /* ======================
          return
    ====================== */

    return (
      <Accordion.Root
        className={`radix-accordion-root${className ? ` ${className}` : ''}`}
        ref={forwardedRef as any}
        style={style}
        {...otherProps} // type, value, collapsible, defaultValue, etc.
      >
        {children}
      </Accordion.Root>
    )
  }
)

const CompoundComponent = Object.assign(RadixAccordion, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent
})

export { CompoundComponent as RadixAccordion }

/* Usage Example:

<RadixAccordion
  // At this level, if you use initial, it will be the grayish color
  // that is used to create quasi-borders between accordion items.
  // [--radix-accordion-trigger-hover-bg:initial]
  // Instead, explicitly set the AccordionItem background color and do this:
  // className='bg-white [--radix-accordion-trigger-hover-bg:initial]'
  className={`
  my-accordion
  border-none
  [--radix-accordion-animation-duration:200ms]          
  [--radix-accordion-border-radius:0px]
  [--radix-accordion-chevron-size:1em]
  `}
  ref={accordionRef}
  // Changing to multiple means you also have to change your defaultValue to an array
  type='multiple'
  // defaultValue={['item1']} // Omit if you don't want an item open initially.
  // collapsible={true} // 'single' only
>
  <AccordionItem
    className='bg-white [--radix-accordion-trigger-hover-bg:initial]'
    style={{}}
    value='item1'
  >
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      <div className='p-4'>
        <p>Yes. It adheres to the WAI-ARIA design pattern.</p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Distinctio culpa, recusandae veritatis fugit necessitatibus
          laboriosam et quas perspiciatis hic non, alias delectus facere
          architecto expedita. Eaque nam itaque quas, deleniti,
          voluptatem dignissimos quis officiis libero perferendis quia
          aliquam, iure reprehenderit repellendus vero. Dolores incidunt
          ducimus voluptate, eos ea praesentium consequuntur a ad sunt
          nihil tenetur error, fuga quidem accusamus vitae commodi! Qui
          natus eos distinctio totam corrupti beatae sequi praesentium
          esse, ratione unde. Ut, illo esse libero in, dicta minima
          debitis architecto hic consequatur, voluptatibus eum.
          Exercitationem nihil eligendi officia perferendis, dignissimos
          nemo provident laborum tempore quas accusantium laudantium
          odit!
        </p>
      </div>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem
    value='item2'
    className='bg-white [--radix-accordion-trigger-hover-bg:initial]'
  >
    <AccordionTrigger>Is it unstyled?</AccordionTrigger>
    <AccordionContent>
      <div className='p-4'>
        Yes. It's unstyled by default, giving you freedom over the look
        and feel.
      </div>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem
    value='item3'
    className='bg-white [--radix-accordion-trigger-hover-bg:initial]'
  >
    <AccordionTrigger>Can it be animated?</AccordionTrigger>

    <AccordionContent>
      <div className='p-4'>
        Yes! You can animate the Accordion with CSS or JavaScript.
      </div>
    </AccordionContent>
  </AccordionItem>
</RadixAccordion>

  <Accordion
    className='my-accordion'
    ref={accordionRef}
    style={{}}
    type='single'
    defaultValue={'item1'} // Omit if you don't want an item open initially.
    collapsible={true}
  >
    <AccordionItem style={{}} value='item1'>
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        <p>Yes. It adheres to the WAI-ARIA design pattern.</p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          culpa, recusandae veritatis fugit necessitatibus laboriosam et quas
          perspiciatis hic non, alias delectus facere architecto expedita.
          Eaque nam itaque quas, deleniti, voluptatem dignissimos quis
          officiis libero perferendis quia aliquam, iure reprehenderit
          repellendus vero. Dolores incidunt ducimus voluptate, eos ea
          praesentium consequuntur a ad sunt nihil tenetur error, fuga quidem
          accusamus vitae commodi! Qui natus eos distinctio totam corrupti
          beatae sequi praesentium esse, ratione unde. Ut, illo esse libero
          in, dicta minima debitis architecto hic consequatur, voluptatibus
          eum. Exercitationem nihil eligendi officia perferendis, dignissimos
          nemo provident laborum tempore quas accusantium laudantium odit!
        </p>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value='item2'>
      <AccordionTrigger>Is it unstyled?</AccordionTrigger>
      <AccordionContent>
        Yes. It's unstyled by default, giving you freedom over the look and
        feel.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value='item3'>
      <AccordionTrigger>Can it be animated?</AccordionTrigger>

      <AccordionContent>
        Yes! You can animate the Accordion with CSS or JavaScript.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
*/
