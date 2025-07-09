import { forwardRef, ComponentPropsWithoutRef, ElementRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from 'utils'

type Props = ComponentPropsWithoutRef<typeof Dialog.Overlay>

/* ========================================================================

======================================================================== */

export const SheetOverlay = forwardRef<
  ElementRef<typeof Dialog.Overlay>,
  Props
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
      className
    )}
    {...props}
    ref={ref}
  />
))

SheetOverlay.displayName = Dialog.Overlay.displayName
