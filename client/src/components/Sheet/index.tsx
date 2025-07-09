// https://www.radix-ui.com/primitives/docs/components/dialog
// https://ui.shadcn.com/docs/components/sheet
// shadcn/ui cleverly took the Radix Dialog and turned it into an OffCanvas.

import * as Dialog from '@radix-ui/react-dialog'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close
export const SheetPortal = Dialog.Portal

export * from './SheetOverlay'
export * from './SheetHeader'
export * from './SheetFooter'
export * from './SheetTitle'
export * from './SheetDescription'
export * from './SheetContent'
