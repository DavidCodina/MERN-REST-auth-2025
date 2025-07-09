// Custom imports
import { PaginationItem } from './PaginationItem'
import { IPagination } from './types'

/* ========================================================================
                                Pagination
======================================================================== */

const Pagination = ({
  children,
  className = '',
  paginationSize,
  style = {},
  ...otherProps
}: IPagination) => {
  /* ======================
    getPaginationClasses()
  ====================== */

  const getPaginationClasses = () => {
    let classes = 'pagination select-none'

    if (paginationSize === 'small') {
      classes = `${classes} pagination-sm`
    } else if (paginationSize === 'large') {
      classes = `${classes} pagination-lg`
    }
    if (className) {
      classes = `${classes} ${className}`
    }
    return classes
  }

  /* ======================
          return
  ====================== */

  return (
    <ul className={getPaginationClasses()} style={style} {...otherProps}>
      {children}
    </ul>
  )
}

const CompoundComponent = Object.assign(Pagination, {
  Item: PaginationItem
})

export { CompoundComponent as Pagination, PaginationItem }
