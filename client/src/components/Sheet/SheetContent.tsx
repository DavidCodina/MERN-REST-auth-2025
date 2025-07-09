import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { SheetOverlay } from './SheetOverlay'
import { cn } from 'utils'

const SheetPortal = Dialog.Portal

// Note that this is still contstraned by 'sm:max-w-sm'
const horizontalWidth = 'w-3/4'

/* ========================================================================

======================================================================== */
// This uses classes from tailwindcss-animate.
// https://github.com/jamiebuilds/tailwindcss-animate

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top max-h-full',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom max-h-full',
        left: `inset-y-0 left-0 h-full ${horizontalWidth} border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm`,
        right: `inset-y-0 right-0 h-full ${horizontalWidth} border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm`
      }
    },
    defaultVariants: {
      side: 'right'
    }
  }
)

/* ========================================================================

======================================================================== */

type Props = ComponentPropsWithoutRef<typeof Dialog.Content> &
  VariantProps<typeof sheetVariants>

export const SheetContent = forwardRef<
  ElementRef<typeof Dialog.Content>,
  Props
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />

    <Dialog.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <Dialog.Close
        className={`ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinejoin='round'
          strokeLinecap='round'
          className='h-4 w-4'
        >
          <path d='M18 6 6 18'></path>
          <path d='m6 6 12 12'></path>
        </svg>

        <span className='sr-only'>Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </SheetPortal>
))

SheetContent.displayName = Dialog.Content.displayName
