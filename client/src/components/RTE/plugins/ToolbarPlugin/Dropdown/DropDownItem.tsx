import {
  useEffect,
  useRef,
  MouseEvent,
  ReactNode,
  useContext,
  RefObject
} from 'react'
import { DropDownContext } from './DropDownContext'

/* ========================================================================
                              DropDownItem                     
======================================================================== */
// Used by ToolbarPlugin.tsx

export const DropDownItem = ({
  children,
  className,
  onClick,
  title
}: {
  children: ReactNode
  className: string
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  title?: string
}) => {
  const ref = useRef<HTMLButtonElement>(null)

  const dropDownContext = useContext(DropDownContext)

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a DropDown')
  }

  const { registerItem } = dropDownContext

  /* ======================
       useEffect()
  ====================== */

  useEffect(() => {
    if (ref && ref.current) {
      registerItem(ref as RefObject<HTMLButtonElement>)
    }
  }, [ref, registerItem])

  /* ======================
          return
  ====================== */

  return (
    <button
      className={className}
      onClick={onClick}
      ref={ref}
      title={title}
      type='button'
    >
      {children}
    </button>
  )
}
