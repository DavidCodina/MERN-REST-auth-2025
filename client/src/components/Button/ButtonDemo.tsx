import { Fragment, useState } from 'react'
import { Button } from './'

const customSpinner = (
  <div aria-label='Loading' className='relative inline-flex h-[1em] w-[1em]'>
    <i
      className='absolute h-full w-full animate-spin rounded-full border-[1.5px] border-solid border-t-transparent border-r-transparent border-b-current border-l-transparent'
      style={{
        animationTimingFunction: 'ease',
        animationDuration: '0.8s',
        animationIterationCount: 'infinite'
      }}
    />

    <i
      className='absolute h-full w-full animate-spin rounded-full border-[1.5px] border-dotted border-t-transparent border-r-transparent border-b-current border-l-transparent opacity-75'
      style={{
        animationTimingFunction: 'linear',
        animationDuration: '0.8s',
        animationIterationCount: 'infinite'
      }}
    />
  </div>
)

/* ========================================================================
                              ButtonDemo
======================================================================== */

export const ButtonDemo = () => {
  const [loading, setLoading] = useState(false)

  /* ======================
        handleLoading()
  ====================== */

  const handleLoading = () => {
    if (loading) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }

  /* ======================
            return
  ====================== */
  return (
    <Fragment>
      <div className='mb-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-violet-800 bg-white p-4'>
        <button className='btn-red btn-xs'>Red Button</button>

        <Button
          loading={loading}
          isIconOnly
          loader={customSpinner}
          //loadingStyle={{ height: '1em' }}
          className='btn-red btn-xs'
          onClick={handleLoading}
        >
          <svg
            style={{ height: '1em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
            <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
          </svg>
        </Button>
        <button className='btn-orange btn-sm'>Orange Button</button>
        <button className='btn-yellow'>Yellow Button</button>
        <button className='btn-green btn-lg'>Green Button</button>
        <button className='btn-blue btn-xl'>Blue Button</button>
        <button className='btn-purple btn-2xl'>Purple Button</button>
      </div>

      <div className='mb-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-violet-800 bg-white p-4'>
        <button className='btn-outline-red btn-xs'>Red Button</button>
        <Button
          loading={loading}
          isIconOnly
          loadingStyle={{ height: '1em' }}
          className='btn-outline-red btn-xs'
          onClick={handleLoading}
        >
          <svg
            style={{ height: '1em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
            <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
          </svg>
        </Button>
        <button className='btn-outline-orange btn-sm'>Orange Button</button>
        <button className='btn-outline-yellow'>Yellow Button</button>
        <button className='btn-outline-green btn-lg'>Green Button</button>
        <button className='btn-outline-blue btn-xl'>Blue Button</button>
        <button className='btn-outline-purple btn-2xl'>Purple Button</button>
      </div>

      <div className='mb-6 flex items-center rounded-xl border border-violet-800 bg-white p-4'>
        <Button
          // loading
          className='btn-green mx-auto flex w-full'
          leftSection={
            <svg
              style={{ height: '1em' }}
              viewBox='0 0 24 24'
              aria-hidden='true'
              focusable='false'
            >
              <g
                fill='none'
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-miterlimit='10'
                stroke-width='1.5'
              >
                <path
                  data-name='Stroke 1'
                  d='M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z'
                ></path>
                <path
                  data-name='Stroke 3'
                  d='M11.837 11.174a4.372 4.372 0 10-.031 0z'
                ></path>
              </g>
            </svg>
          }
          rightSection={
            <svg
              style={{ height: '1em' }}
              viewBox='0 0 24 24'
              fill='none'
              focusable='false'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z'
                fill='currentColor'
              ></path>
            </svg>
          }
        >
          Click Me
        </Button>
      </div>
    </Fragment>
  )
}
