import { HTMLAttributes } from 'react'
import { cn } from 'utils'

type Props = HTMLAttributes<HTMLDivElement>

/* ========================================================================

======================================================================== */

export const SheetHeader = ({ className, ...props }: Props) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'
