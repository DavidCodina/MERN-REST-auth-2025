import { SCCounter, SCBox, TWCounter, SassCounter } from '../'

/* ========================================================================

======================================================================== */

export const SBDemos = () => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <div className='mb-2 flex justify-center'>
        <TWCounter />
      </div>

      <div className='mb-2 flex justify-center'>
        <SassCounter />
      </div>

      <div className='mb-2 flex justify-center'>
        <SCCounter />
      </div>

      <div className='mb-2 flex justify-center'>
        <SCBox />
      </div>
    </div>
  )
}
