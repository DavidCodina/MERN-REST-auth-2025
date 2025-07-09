// Third-party imports
import { Fragment, useState } from 'react'

// Custom imports
import { Button } from 'components/Button'
import { SimpleCollapse } from './'

/* ========================================================================

======================================================================== */

export const SimpleCollapseDemo = () => {
  const [show, setShow] = useState(false)

  return (
    <Fragment>
      <Button
        className='btn-blue btn-sm mx-auto mb-4 block'
        onClick={() => {
          setShow((v) => !v)
        }}
      >
        {show ? 'Hide Content' : 'Show Content'}
      </Button>

      <SimpleCollapse
        className='mx-auto max-w-[600px]'
        duration={500}
        show={show}
        style={{}}
      >
        <div
          // The Collapse removes overlow:hidden after transitioning.
          // However, if you want to ensure that the shadow is shown even when
          // transitioning, then you can add margins.
          className={`mx-1 mb-1 rounded-lg border bg-white p-2 px-4 dark:border-(--dark-primary-color) dark:bg-(--dark-bg-color) ${show ? 'py-4' : 'py-1'} shadow-[0px_2px_3px_rgba(0,_0,_0,_0.15)]`}
          style={{
            transition: 'padding 500ms linear'
          }}
        >
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo
            similique facilis fugiat inventore quam dicta reprehenderit
            doloremque magni eligendi commodi, aut aliquid eos sit dolor earum
            distinctio iusto porro. Veritatis et ex explicabo similique corrupti
            voluptatibus qui, debitis consequatur natus reiciendis corporis
            magnam eos iusto ratione voluptatem deleniti sint. Deleniti
            cupiditate dolor, optio distinctio laudantium ipsum nulla molestiae
            deserunt omnis, nemo debitis, labore sint? Minima beatae, temporibus
            unde voluptatum omnis necessitatibus odio similique culpa officiis
            nostrum nam quasi nobis itaque ea possimus impedit quaerat magnam
            dignissimos velit corporis cumque, hic quas! Voluptas ducimus amet
            sunt vel non consectetur perferendis vitae!
          </p>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo
            similique facilis fugiat inventore quam dicta reprehenderit
            doloremque magni eligendi commodi, aut aliquid eos sit dolor earum
            distinctio iusto porro. Veritatis et ex explicabo similique corrupti
            voluptatibus qui, debitis consequatur natus reiciendis corporis
            magnam eos iusto ratione voluptatem deleniti sint. Deleniti
            cupiditate dolor, optio distinctio laudantium ipsum nulla molestiae
            deserunt omnis, nemo debitis, labore sint?
          </p>
        </div>
      </SimpleCollapse>
    </Fragment>
  )
}
