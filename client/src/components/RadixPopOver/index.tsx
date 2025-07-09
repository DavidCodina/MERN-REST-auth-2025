import * as Popover from '@radix-ui/react-popover'
import { IRadixPopOver } from './types'

//# What to do about focus ring when there is not close button...
//# Figure out a better focus ring for the close button.

/* ========================================================================
                                RadixPopOver
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/components/popover
// Displays rich content in a portal, triggered by a button.
//
// A popover is very similar to a tooltip. The difference is primarily
// that a tooltip shows up on focus or hover (for buttons, inputs, etc)
// and then automatically goes away on user interaction with the trigger element.
// A popover is more like a mini-modal in that it's target is created for the sole
// purpose of displaying some content onClick. Good use cases include an info icon,
// and a delete button whereby we want to first render a confirmation popup.
//
//   Space       : Opens/closes the popover.
//   Enter       : Opens/closes the popover.
//   Tab         : Moves focus to the next focusable element
//   Shift + Tab : Moves focus to the previous focusable element
//   Esc         : Closes the popover and moves focus to Popover.Trigger.
//
// Both the Radix Tooltip and Popover allow for controlled implementations.
// That said, doing something like getting the Popover to open on hover or
// the Tooltip to open (and stay open) on click is surprisingly tricky to
// get right. Super annoying!
//
// I did finally manage to get the tooltip to work like a popover, so if what
// you need is a popover that also works on hover then use the tooltip (or hover card)
// with the custom toggleForceMount prop. Why? The behavior of a tooltip or hover card
// with optional toggleForceMount is more intuitive to use from an accessibility
// standpoint than a popover that has a hoverForceMount option.
//
// The problem with adding a hoverForceMount prop here is that it's unclear how
// to handle the focusing behavior. Obviously, automatically switching the focus
// to a new element merely as a result of hovering is way too aggressive.
// On the other hand, if we don't handle where to place the focus then, tabbing won't
// work intuitively as it does in the default popover implementation. For this reason,
// I have decided NOT to add the hoverForceMount feature.
//
// The realization after working on these components is that there's a good reason
// to differentiate between a tooltip and a popup, which only really makes sense
// when you consider it from an accessibility standpoint.
//
///////////////////////////////////////////////////////////////////////////

const RadixPopOver = ({
  trigger,

  children,

  contentClassName = '',
  contentStyle = {},

  arrow = true,
  arrowClassName = '',
  arrowStyle = {},

  defaultOpen = false,
  side = 'top', // Radix defaults it to 'bottom'
  sideOffset = 10,
  // It's probably a best-practice to include the close button.
  // Otherwise, closing the popup is with space or Enter is not possible,
  // and closing will only work with ESC (i.e., less accessible).
  closeButton = true
}: IRadixPopOver) => {
  /* ======================
          return
  ====================== */

  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          style={contentStyle}
          className={`radix-popover-content${
            contentClassName ? ` ${contentClassName}` : ''
          }`}
          sideOffset={sideOffset}
          side={side}
        >
          {closeButton && (
            <Popover.Close
              className='radix-popover-close-btn'
              aria-label='Close'
            >
              <svg
                width='24'
                height='24'
                // fill='currentColor'
                viewBox='0 0 16 16'
              >
                <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' />
              </svg>
            </Popover.Close>
          )}

          {children}

          {arrow && (
            <Popover.Arrow
              // You could do this, but using the style prop instead allows it to be configured by consumer.
              // width={20}
              // height={8}
              className={`radix-popover-arrow${
                arrowClassName ? ` ${arrowClassName}` : ''
              }`}
              style={{
                width: 20,
                height: 8,
                top: -2.5, // Doesn't need to be fixed for different sides. It just works!
                position: 'relative',
                ...arrowStyle
              }}
            />
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

// Note: the calc() string needs space between the minus symbol, which means
// that it will NOT work within a Tailwind arbitrary value.
const clampMaxWidthToViewport = (
  width: number,
  horizontalPadding: number = 10
) => {
  return `clamp(0px, ${width}px, calc(100vw - ${horizontalPadding * 2}px))`
}

const CompoundComponent = Object.assign(RadixPopOver, {
  clampMaxWidthToViewport: clampMaxWidthToViewport
})

export { CompoundComponent as RadixPopOver }
