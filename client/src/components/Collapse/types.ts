export interface ICollapse {
  children: React.ReactNode
  isOpen: boolean
  className?: string
  style?: React.CSSProperties
  disableTransition?: boolean
  duration?: number
}
