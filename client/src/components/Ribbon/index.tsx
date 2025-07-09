import { ReactNode } from 'react'
import './index.css'

/* =============================================================================
                                  Ribbon
============================================================================= */
/* Usage:

<div
  style={{
    margin: '0 auto',
    height: 200,
    position: 'relative',
    width: 300,
    backgroundColor: '#fff',
    border: '1px solid #333',
    borderRadius: 5
  }}
>
  <Ribbon>Demo</Ribbon>
</div>

*/
export const Ribbon = ({ children }: { children: ReactNode }) => {
  return (
    <div className='ribbon-container'>
      <div className='ms-ribbon'>{children} </div>
    </div>
  )
}
