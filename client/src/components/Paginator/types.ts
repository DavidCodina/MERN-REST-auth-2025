// https://stackoverflow.com/questions/68038912/only-odd-numbers-type-for-typescript
// This solution for generating a range of odd numbers is a little overkill for the
// current use case. One could just as easily type a union of: 3 | 5 | 7. That said,
// it's a cool pattern and allows for any number of odd numbers, so if you wanted
// 3 to 1001, you obviously wouldn't want to type all that out.

type OddNumber<
  X extends number,
  Y extends unknown[] = [1],
  Z extends number = never
> = Y['length'] extends X
  ? Z | Y['length']
  : OddNumber<X, [1, 1, ...Y], Z | Y['length']>

export type OddNumberUpTo7 = OddNumber<7>

export interface IPaginator {
  /** Note: when active className and style variants are not defined,
   * they default to the non-active counterparts. The active variants
   * overwrite and entirely REPLACE the non-active variants, rather
   * than merging with them. */
  activePaginationButtonClassName?: string
  activePaginationButtonStyle?: React.CSSProperties
  activePaginationItemClassName?: string
  activePaginationItemStyle?: React.CSSProperties
  activeOnHoverButtonStyle?: React.CSSProperties
  activeOnFocusButtonStyle?: React.CSSProperties

  paginationClassName?: string
  paginationStyle?: React.CSSProperties

  paginationItemClassName?: string
  paginationItemStyle?: React.CSSProperties

  paginationButtonClassName?: string
  paginationButtonStyle?: React.CSSProperties
  onHoverButtonStyle?: React.CSSProperties
  onFocusButtonStyle?: React.CSSProperties

  page: number
  onClick: (
    newPage: number,
    prevPage: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  itemsPerPage: number
  numberedItems?: OddNumberUpTo7
  itemCount: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  /** This refers the size of the component, NOT the number of items being paginated. */
  paginationSize?: 'small' | 'large'
}
