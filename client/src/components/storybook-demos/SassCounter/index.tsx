import { useState } from 'react'
import './index.scss'
/* ========================================================================
                                SassCounter
======================================================================== */
// This is merely to manual test the Storybook/Sass implementation.
// With a Vite setup, I literally had to do NOTHING, which is amazing!
// Bye bye Webpack!

export const SassCounter = () => {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount((v) => v + 1)} className='sass-counter'>
      <span>Count: {count}</span>
    </button>
  )
}
