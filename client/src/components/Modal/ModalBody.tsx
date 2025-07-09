import { twMerge } from 'tailwind-merge'
import { IModalBody } from './types'

/* ========================================================================
                                  ModalBody
======================================================================== */

export function ModalBody({
  className = '',
  children,
  style = {}
}: IModalBody) {
  /* ======================
      getClassName()
  ====================== */

  const getClassName = () => {
    const base = 'xx-modal-body'
    const _className = twMerge(`${base}`, className)
    return _className
  }

  /* ======================
          return
  ====================== */

  return (
    <div className={getClassName()} style={style}>
      {children}
    </div>
  )
}
