import { useState } from 'react'
import { SCButton } from './styles'

/* ========================================================================
                                SCCounter
======================================================================== */
// This is merely to manual test the Storybook / Styled Components implementation.

export const SCCounter = () => {
  const [count, setCount] = useState(0)
  return (
    <SCButton onClick={() => setCount((v) => v + 1)}>
      <span>Count: {count}</span>
    </SCButton>
  )
}
