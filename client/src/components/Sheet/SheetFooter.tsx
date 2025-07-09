import { HTMLAttributes } from 'react'
import { cn } from 'utils'

type Props = HTMLAttributes<HTMLDivElement>

/* ========================================================================

======================================================================== */

export const SheetFooter = ({ className, ...props }: Props) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = 'SheetFooter'
