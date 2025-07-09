// Third-party imports
import { Fragment, useEffect, useRef } from 'react'

// Custom imports
import { Accordion } from '../Accordion'

/* ========================================================================
                              AccordionDemo
======================================================================== */

export const AccordionDemo = () => {
  const accRef = useRef<HTMLDivElement | null>(null)

  const item1Ref = useRef<HTMLDivElement | null>(null)
  const trigger1Ref = useRef<HTMLButtonElement | null>(null)
  const content1Ref = useRef<HTMLDivElement | null>(null)

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    // if (accRef.current) {
    //   console.log(accRef.current)
    // }
    // if (content1Ref.current) {
    //   console.log('content1Ref',content1Ref.current)
    // }

    if (item1Ref.current) {
      console.log('item1Ref', item1Ref.current)
    }

    // if (trigger1Ref.current) {
    //   console.log('trigger1Ref', trigger1Ref.current)
    // }
  }, [])

  /* ======================
       accordionItems
  ====================== */
  // Because Accordion Items communicate with Accordion through AccordionContext,
  // we can easily pass content wrappend in a <Fragment>. In theory, you could also
  // wrap it in any other element (e.g., <div>, etc.) except for the fact that some
  // of the CSS is looking for direct child selector ( > ) relationships...

  const renderAccordionItems = () => {
    return (
      <Fragment>
        <Accordion.Item
          className='item-1'
          ref={item1Ref}
          title='Item 1'
          value='item1'
        >
          <Accordion.Trigger ref={trigger1Ref}>Item 1</Accordion.Trigger>
          <Accordion.Content ref={content1Ref}>
            <div className='p-4 text-sm'>
              <h5 className='font-black text-pink-500'>Item 1:</h5>

              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam,
                adipisci recusandae? Quidem asperiores molestias, ad iusto sed
                fuga iure cupiditate repudiandae ratione sunt nulla vitae quas
                porro voluptas amet voluptatum libero debitis? Odio, sequi
                soluta! Vitae, natus fuga iste ipsam enim cum reprehenderit
                voluptas, eveniet molestias vel laudantium eligendi aliquid?
              </p>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item className='item-2' title='Item 2' value='item2'>
          <Accordion.Trigger>Item 2</Accordion.Trigger>
          <Accordion.Content duration={500}>
            <div className='p-4 text-sm'>
              <h5 className='font-black text-pink-500'>Item 2:</h5>

              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam,
                adipisci recusandae? Quidem asperiores molestias, ad iusto sed
                fuga iure cupiditate repudiandae ratione sunt nulla vitae quas
                porro voluptas amet voluptatum libero debitis? Odio, sequi
                soluta! Vitae, natus fuga iste ipsam enim cum reprehenderit
                voluptas, eveniet molestias vel laudantium eligendi aliquid?
              </p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Fragment>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <Accordion
        ref={accRef}
        // collapsible={false}
        type='single'
        // duration={100}
        defaultValue={['item1']}
        // disableTransition
        className='mx-auto mb-6 max-w-[800px] rounded-lg shadow-sm shadow-neutral-500'
      >
        {renderAccordionItems()}
      </Accordion>
    </Fragment>
  )
}
