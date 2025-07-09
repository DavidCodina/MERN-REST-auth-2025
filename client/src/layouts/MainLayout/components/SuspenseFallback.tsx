const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================
                                SuspenseFallback 
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Supppose we had the following loader implementation:
//
//   export const LazyPageAbout = lazy(async () => {
//     await sleep(3000)
//     return import('./')
//   })
//
//   export const loader = async () => {
//     await sleep(3000)
//     return null
//   }
//
// MainLayout.tsx would render the FixedGlobalSpinner for the duration of the loader await time.
// Then MainLayout.tsx would render SuspenseFallback for the duration of the LazyPageAbout wait time.
// Admittedly, the above example is contrived.
//
///////////////////////////////////////////////////////////////////////////

export const SuspenseFallback = () => {
  const spinner = (
    <div
      aria-label='Loading'
      className='pointer-events-none fixed inset-0 flex items-center justify-center'
    >
      <div className='relative flex h-20 w-20'>
        <i className='absolute h-full w-full animate-[custom-spinner-spin_0.8s_ease_infinite] rounded-full border-[6px] border-solid border-t-transparent border-r-transparent border-b-violet-800 border-l-transparent'></i>
        <i className='absolute h-full w-full animate-[custom-spinner-spin_0.8s_linear_infinite] rounded-full border-[6px] border-dotted border-t-transparent border-r-transparent border-b-violet-800 border-l-transparent opacity-75'></i>
      </div>
    </div>
  )

  /* ======================
          return
  ====================== */

  return (
    <div
      className={`mx-auto flex w-full flex-1 flex-wrap`}
      style={{ backgroundImage }}
    >
      <div className='relative mx-auto w-full flex-1 p-6 2xl:container'>
        {spinner}
      </div>
    </div>
  )

  // This JSX was used just for testing lazy + preloading, but obviously
  // you don't want a big dumb loading <h1> every time something lazy loads.

  // return (
  //   <div className='mx-auto w-full flex-1 p-6 2xl:container'>
  //     <h1 className='tex-6xl py-5 text-center font-black text-red-500'>
  //       Thinking...
  //     </h1>
  //   </div>
  // )
}
