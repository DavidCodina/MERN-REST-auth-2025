import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from 'utils'

type Props = ComponentPropsWithoutRef<typeof Dialog.Title>

/* ========================================================================

======================================================================== */

export const SheetTitle = forwardRef<ElementRef<typeof Dialog.Title>, Props>(
  ({ className, ...props }, ref) => (
    <Dialog.Title
      ref={ref}
      className={cn('text-foreground text-lg font-semibold', className)}
      {...props}
    />
  )
)

SheetTitle.displayName = Dialog.Title.displayName
