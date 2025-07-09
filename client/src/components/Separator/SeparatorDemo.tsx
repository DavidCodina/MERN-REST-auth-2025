import { Separator } from './'

// The default className has been added to the component as a default.
// Passing in any className will completely overwrite it.
// const separatorStyle = `bg-white data-[orientation=horizontal]:my-4 data-[orientation=horizontal]:h-px data-[orientation=vertical]:mx-4 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px`

/* ========================================================================
                              SeparatorDemo
======================================================================== */

export const SeparatorDemo = () => {
  return (
    <section
      className='mx-auto flex max-w-4xl items-center justify-center rounded-xl border border-indigo-800 text-white shadow-lg'
      style={{
        background: 'linear-gradient(to bottom, #24c6dc, #514a9d)',
        minHeight: 300
      }}
    >
      <div className='w-full max-w-[300px]'>
        <div className='m-0 text-center text-lg leading-none font-bold'>
          My Awesome Separator!
        </div>

        <Separator
        // className={separatorStyle}
        />

        <div className='flex h-5 items-center justify-center'>
          <div className='text-[15px] leading-5 text-white'>Section 1</div>
          <Separator
            //className={separatorStyle}
            decorative // ???
            orientation='vertical'
          />
          <div className='text-[15px] leading-5 text-white'>Section 2</div>
          <Separator
            //className={separatorStyle}
            decorative // ???
            orientation='vertical'
          />
          <div className='text-[15px] leading-5 text-white'>Section 3</div>
        </div>
      </div>
    </section>
  )
}
