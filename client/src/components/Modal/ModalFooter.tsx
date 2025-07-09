// Custom imports
import { twMerge } from 'tailwind-merge'
import { IModalFooter } from './types'

/* ========================================================================
                                  ModalFooter
======================================================================== */

export function ModalFooter({
  children,
  className = '',
  style = {}
}: IModalFooter) {
  /* ======================
      getClassName()
  ====================== */

  const getClassName = () => {
    const base =
      'xx-modal-footer transition-colors duration-300 ease-linear dark:border-t dark:border-(--dark-primary-color)'
    const background = `bg-white dark:bg-(--dark-body-color)`
    const shadow = `shadow-[0_-1px_2px__rgba(0,0,0,0.35)]`
    const _className = twMerge(`${base} ${background} ${shadow}`, className)
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
