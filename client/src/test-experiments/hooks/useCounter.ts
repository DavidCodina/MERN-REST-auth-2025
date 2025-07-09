import { useState } from 'react'

type UseCounterReturnType = {
  count: number
  decrement: () => void
  increment: () => void
  reset: () => void
}

/* ========================================================================
       
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//  const { count, decrement, increment, reset } = useCounter(0)
//
//  ...
//
//   <section className='mx-auto mb-6 max-w-[400px] rounded-lg border border-neutral-400 bg-white p-4 shadow'>
//     <div className='mb-2 flex justify-center gap-2'>
//       <button className='btn-sm btn-blue' onClick={decrement}>-</button>
//       <button className='btn-sm btn-blue' onClick={reset}>Reset</button>
//       <button className='btn-sm btn-blue' onClick={increment}>+</button>
//     </div>
//     <div className='text-center text-4xl leading-none font-bold text-blue-500'>{count}</div>
//   </section>
//
///////////////////////////////////////////////////////////////////////////

export const useCounter = (initialCount: number = 0): UseCounterReturnType => {
  const [count, setCount] = useState(initialCount)

  const decrement = () => setCount((v) => v - 1)
  const increment = () => setCount((v) => v + 1)
  const reset = () => setCount(0)

  return { count, decrement, increment, reset }
}
