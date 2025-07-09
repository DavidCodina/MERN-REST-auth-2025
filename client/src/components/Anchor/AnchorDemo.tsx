import { Anchor } from './'

/* ========================================================================
                                AnchorDemo
======================================================================== */

export const AnchorDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <article className='rounded-lg border border-gray-500 bg-white p-4 shadow-lg'>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis
          accusantium, molestiae et blanditiis dicta autem. Impedit voluptate
          officia excepturi reprehenderit! Quo veniam omnis pariatur
          exercitationem aut totam!{' '}
          <Anchor
            // disabled
            className='font-semibold text-pink-500 hover:text-pink-600'
            underline='hover'
            href='https://www.google.com/'
            onClick={() => {
              alert('Note: onClick disables the href.')
            }}
          >
            google.com
          </Anchor>{' '}
          Ipsam accusamus dolorem obcaecati perferendis animi autem doloremque
          nobis. Quas impedit incidunt perspiciatis, dolorem qui fugiat
          asperiores saepe eligendi temporibus, cum consectetur deleniti?
        </p>

        <Anchor
          // disabled
          className='btn-green btn-sm mx-auto'
          underline='never'
          href='https://www.google.com'
          style={{ display: 'table' }}
        >
          google.com
        </Anchor>
      </article>
    </>
  )
}
