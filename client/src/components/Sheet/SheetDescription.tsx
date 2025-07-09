import { forwardRef, ComponentPropsWithoutRef, ElementRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from 'utils'

type Props = ComponentPropsWithoutRef<typeof Dialog.Description>

/* ========================================================================

======================================================================== */

export const SheetDescription = forwardRef<
  ElementRef<typeof Dialog.Description>,
  Props
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
))

SheetDescription.displayName = Dialog.Description.displayName
