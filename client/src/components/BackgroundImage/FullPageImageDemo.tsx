import { Fragment } from 'react'
import { BackgroundImage } from './index'
import person from './person.jpg'

/* ========================================================================
                      
======================================================================== */

export const FullPageImageDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <BackgroundImage
        src={person}
        // relative is used here to help it have the correct stacking order.
        // shrink-0 may not be needed, but doesn't hurt.
        className={`group relative flex h-[100vh] w-full shrink-0 items-center justify-center overflow-auto bg-white/0 p-4 bg-blend-overlay transition-colors duration-700 hover:bg-white/60`}
      >
        {/* Fun hover effect, but obviously don't do this in production because some users will be on mobile. */}
        <div className='w-full max-w-2xl rounded-xl border border-neutral-500 bg-white p-4 text-base opacity-0 shadow-xl transition-opacity duration-1000 group-hover:opacity-100'>
          <p>This is a simple demo of a full page background image.</p>

          <pre className='mx-auto w-11/12 rounded-xl border border-neutral-500 bg-neutral-50 text-xs leading-normal font-normal shadow'>
            <code>{`
  // relative is used here to help give it the correct stacking order.
  // shrink-0 may not be needed, but doesn't hurt.

  <BackgroundImage
    src={person}
    className='relative flex h-[100vh] w-full shrink-0 items-center justify-center overflow-auto bg-white/50 p-4 bg-blend-overlay transition-colors duration-700 hover:bg-white/80'
  >...</BackgroundImage>
        `}</code>
          </pre>

          <p>
            If you were to implement it on a page component, then you'd want to
            do it outside of the content container.
          </p>

          <pre className='mx-auto w-11/12 rounded-xl border border-neutral-500 bg-neutral-50 text-xs leading-normal font-normal shadow'>
            <code>{`
  <div className={'mx-auto flex w-full flex-1 flex-wrap'}>
    <FullPageImageDemo />
    
    <div className='relative mx-auto w-full flex-1 p-6 2xl:container'>
      // Page content here...
    </div>
  </div>
        `}</code>
          </pre>

          <p>
            If you wanted to use filters, then you'd need to change the
            implementation to a quasi-fixed content approach (See other
            examples).
          </p>
        </div>
      </BackgroundImage>
    </Fragment>
  )
}
