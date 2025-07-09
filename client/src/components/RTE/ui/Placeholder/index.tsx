import './Placeholder.css'
import * as React from 'react'
import { ReactNode, CSSProperties, JSX } from 'react'

interface IPlaceholder {
  children: ReactNode
  className?: string
  style?: CSSProperties
}
/* ========================================================================
  
======================================================================== */

export const Placeholder = ({
  children,
  className,
  style = {}
}: IPlaceholder): JSX.Element => {
  return (
    <div className={className || 'rte-placeholder'} style={style}>
      {children}
    </div>
  )
}
