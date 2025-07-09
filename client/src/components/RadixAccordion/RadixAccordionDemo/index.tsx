// Third-party imports
import { Fragment, useRef, useEffect } from 'react'

// Custom imports
import {
  RadixAccordion
  // AccordionItem,
  // AccordionTrigger,
  // AccordionContent
} from '../'

import { Button } from '../../Button'

/* ========================================================================
                                RadixAccordionDemo
======================================================================== */

export const RadixAccordionDemo = () => {
  const accordionRef = useRef<HTMLDivElement | null>(null)
  const trigger1Ref = useRef<HTMLButtonElement | null>(null)
  const trigger2Ref = useRef<HTMLButtonElement | null>(null)
  const trigger3Ref = useRef<HTMLButtonElement | null>(null)

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    if (accordionRef.current) {
      console.log('ACCORDION:', accordionRef.current)
    }
  }, [])

  /* ======================
        renderControls
  ====================== */

  const renderControls = () => {
    return (
      <div className='mb-6 flex justify-center gap-2'>
        <Button
          className='btn-blue btn-xs'
          onClick={() => {
            if (trigger1Ref.current) {
              trigger1Ref.current.click()
            }
          }}
        >
          Toggle Item 1
        </Button>

        <Button
          className='btn-blue btn-xs'
          onClick={() => {
            if (trigger2Ref.current) {
              trigger2Ref.current.click()
            }
          }}
        >
          Toggle Item 2
        </Button>

        <Button
          className='btn-blue btn-xs'
          onClick={() => {
            if (trigger3Ref.current) {
              trigger3Ref.current.click()
            }
          }}
        >
          Toggle Item 3
        </Button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      {renderControls()}

      <RadixAccordion
        // ❌ Brute-forcing the border radius:   overflow-hidden rounded-2xl
        // ✅ Using the the CSS custom property: [--radix-accordion-border-radius:theme(borderRadius.2xl)]

        // [--radix-accordion-border-color:#409]
        // [--radix-accordion-border-radius:theme(borderRadius.2xl)]
        // [--radix-accordion-chevron-size:1.5em]
        // [--radix-accordion-trigger-bg:theme(colors.violet.50)]
        // [--radix-accordion-trigger-color:theme(colors.sky.400)]
        // [--radix-accordion-trigger-hover-bg:theme(colors.violet.200)]
        // [--radix-accordion-trigger-hover-color:#409]
        className={`mx-auto max-w-[800px] shadow-lg`}
        ref={accordionRef}
        style={{}}
        type='single'
        defaultValue={'item1'} // Omit if you don't want an item open initially.
        collapsible={true}
        // Not quite sure how this is supposed to work but don''t use.
        // orientation='horizontal'
      >
        <RadixAccordion.Item style={{}} value='item1'>
          <RadixAccordion.Trigger ref={trigger1Ref}>
            Is it accessible?
          </RadixAccordion.Trigger>
          <RadixAccordion.Content>
            <div className='relative p-4 text-sm'>
              <p>Yes. It adheres to the WAI-ARIA design pattern.</p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio culpa, recusandae veritatis fugit necessitatibus
                laboriosam et quas perspiciatis hic non, alias delectus facere
                architecto expedita. Eaque nam itaque quas, deleniti, voluptatem
                dignissimos quis officiis libero perferendis quia aliquam, iure
                reprehenderit repellendus vero. Dolores incidunt ducimus
                voluptate, eos ea praesentium consequuntur a ad sunt nihil
                tenetur error, fuga quidem accusamus vitae commodi! Qui natus
                eos distinctio totam corrupti beatae sequi praesentium esse,
                ratione unde. Ut, illo esse libero in, dicta minima debitis
                architecto hic consequatur, voluptatibus eum. Exercitationem
                nihil eligendi officia perferendis, dignissimos nemo provident
                laborum tempore quas accusantium laudantium odit!
              </p>

              <div
                className='alert alert-indigo absolute w-2/4 flex-col overflow-hidden rounded-2xl bg-stone-100 text-sm shadow-xl'
                style={{
                  top: '90%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1
                }}
              >
                <h5 className='m-0 leading-none'>
                  Content jumps out of container
                </h5>

                <p className='mb-1'>
                  This will still need at least <code>zIndex:1</code> to sit on
                  top of subsequent triggers/content.
                </p>

                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Distinctio culpa, recusandae veritatis fugit necessitatibus
                  laboriosam et quas perspiciatis hic non, alias delectus facere
                  architecto expedita.
                </p>
              </div>
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>

        <RadixAccordion.Item value='item2'>
          <RadixAccordion.Trigger ref={trigger2Ref}>
            Is it unstyled?
          </RadixAccordion.Trigger>
          <RadixAccordion.Content>
            <div className='p-4 text-sm'>
              <p>
                Yes. It's unstyled by default, giving you freedom over the look
                and feel.
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio culpa, recusandae veritatis fugit necessitatibus
                laboriosam et quas perspiciatis hic non, alias delectus facere
                architecto expedita...
              </p>
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>

        <RadixAccordion.Item value='item3'>
          <RadixAccordion.Trigger ref={trigger3Ref}>
            Can it be animated?
          </RadixAccordion.Trigger>

          <RadixAccordion.Content>
            <div className='p-4 text-sm'>
              <p>Yes! You can animate the Accordion with CSS or JavaScript.</p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio culpa, recusandae veritatis fugit necessitatibus
                laboriosam et quas perspiciatis hic non, alias delectus facere
                architecto expedita...
              </p>
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      </RadixAccordion>
    </Fragment>
  )
}
