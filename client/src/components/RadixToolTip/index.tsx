// Third-party imports
import { useState, useRef } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { IToolTip } from './types'

/* ========================================================================
                                RadixToolTip
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/components/tooltip
// A popup that displays information related to an element when
// the element receives keyboard focus or the mouse hovers over it.
//
//   Tab    : Opens/closes the tooltip without delay.
//   Space  : If open, closes the tooltip without delay.
//   Enter  : If open, closes the tooltip without delay.
//   Escape : If open, closes the tooltip without delay.
//
// The Tooltip can be kept open using toggleForceMount. Getting this to behave correctly
// was very tricky. It entails using e.preventDefault() onClick AND onMouseDown, e.preventDefault()
// within onPointerDownOutside() AND toggling forceMount from within the trigger click handler.
// The following are some articles on the topic, but neither of them actually came up with a
// satisfactory solution.
//
//   https://github.com/radix-ui/primitives/issues/2029
//   "Tooltips generally should close on activation (be it pointer or keyboard)
//   so we use onClick for that."
//
//   https://github.com/radix-ui/primitives/issues/1077
//
//
// See here for more info on Tooltips vs Popovers:
//
//   https://ux.stackexchange.com/questions/88844/when-should-i-use-a-popover-vs-a-tooltip
//
// I also learned a lot from the discussion of why the tooltip intentionally doesn't work
// on mobile/tablets:
//
//   https://github.com/radix-ui/primitives/issues/1573
//   https://github.com/radix-ui/primitives/issues/955#issuecomment-960610209
//
///////////////////////////////////////////////////////////////////////////

const RadixToolTip = ({
  trigger,

  children,
  contentClassName = '',
  contentStyle = {},

  arrow = true,
  arrowClassName = '',
  arrowStyle = {},

  defaultOpen = false,
  delayDuration = 700,
  skipDelayDuration = 300,

  side = 'top',
  sideOffset = 10,
  closeOnClick = true,
  toggleForceMount = false // i.e. like tooltip + popover.
}: IToolTip) => {
  const [forceMount, setForceMount] = useState<true | undefined>()
  const triggerRef = useRef<any>(null)
  closeOnClick = toggleForceMount ? false : closeOnClick

  /* ======================
      handleForceMount()
  ====================== */

  const handleForceMount = () => {
    if (!toggleForceMount) {
      return
    }
    if (!forceMount) {
      setForceMount(true)
      return
    }

    setForceMount(undefined)
  }

  /* ======================
          return
  ====================== */

  return (
    <Tooltip.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      <Tooltip.Root defaultOpen={defaultOpen}>
        <Tooltip.Trigger
          asChild
          ref={triggerRef}
          onClick={(e) => {
            // Gotcha: Must be done here AND e.preventDefault() inside onPointerDownOutside().
            // Plus you also NEED onMouseDown={(e) => { e.preventDefault() }
            if (closeOnClick === false) {
              e.preventDefault()
            }
            handleForceMount()
          }}
          onMouseDown={(e) => {
            if (closeOnClick === false) {
              e.preventDefault()
            }
          }}
        >
          {trigger}
        </Tooltip.Trigger>
        <Tooltip.Portal forceMount={forceMount}>
          <Tooltip.Content
            side={side}
            sideOffset={sideOffset}
            className={`radix-tooltip-content${
              contentClassName ? ` ${contentClassName}` : ''
            }`}
            style={contentStyle}
            onPointerDownOutside={(e) => {
              if (triggerRef.current?.contains(e.target)) {
                e.preventDefault()
              }
            }}
          >
            {children}

            {arrow && (
              <Tooltip.Arrow
                // You could do this, but using the style prop instead allows it to be configured by consumer.
                // width={20}
                // height={8}
                className={`radix-tooltip-arrow${
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
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
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

const CompoundComponent = Object.assign(RadixToolTip, {
  clampMaxWidthToViewport: clampMaxWidthToViewport
})

export { CompoundComponent as RadixToolTip }
