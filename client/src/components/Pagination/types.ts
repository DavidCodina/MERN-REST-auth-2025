export interface IPagination extends React.ComponentProps<'ul'> {
  paginationSize?: 'small' | 'large'
}

// https://freshman.tech/snippets/typescript/fix-value-not-exist-eventtarget/
// type HTMLElementEvent<T extends HTMLElement> = Event & {
//   target: T
// }

export type ButtonRefType = HTMLButtonElement

export interface IPaginationItem extends React.ComponentProps<'button'> {
  onHoverButtonStyle?: React.CSSProperties
  onFocusButtonStyle?: React.CSSProperties
  active?: boolean
  first?: boolean
  last?: boolean
  next?: boolean

  paginationButtonClassName?: string
  paginationButtonStyle?: React.CSSProperties
  paginationItemClassName?: string
  paginationItemStyle?: React.CSSProperties
  previous?: boolean
}

// Alternate syntax using a type instead of an interface.
export type PaginationItemType = {
  onHoverButtonStyle?: React.CSSProperties
  active?: boolean
  first?: boolean
  last?: boolean
  next?: boolean
  paginationButtonClassName?: string
  paginationButtonStyle?: React.CSSProperties
  paginationItemClassName?: string
  paginationItemStyle?: React.CSSProperties
  previous?: boolean
} & React.ComponentProps<'button'>
