import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { IRadixDropdown } from './types'

/* ========================================================================
                                RadixDropdown
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
//
// Todo:
// Rather than reexporting component parts as is (below), we could create
// compound abstractions that bake in the associated classNames as follows:
//
//   Item          : '.radix-dropdown-item'
//   SubTrigger    : '.radix-dropdown-subtrigger'
//   ItemIndicator : '.radix-dropdown-item-indicator'
//   Separator     : '.radix-dropdown-separator'
//
// This would remove the step where the consumer has to be aware of those
// classNames as part of the dropdownPlugin.
//
///////////////////////////////////////////////////////////////////////////

const RadixDropdown = ({
  trigger,

  children,
  contentClassName = '',
  contentStyle = {},

  arrow = true,
  arrowClassName = '',
  arrowStyle = {},

  defaultOpen = false,
  modal = false, // Radix sets this to true by default.
  side = 'top',
  sideOffset = 5
}: IRadixDropdown) => {
  /* ======================
          return
  ====================== */

  return (
    <DropdownMenu.Root modal={modal} defaultOpen={defaultOpen}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          // This is important in cases where side is 'left' or 'right'.
          // The sticky prop is either 'partial' or 'always' (i.e., 'never' not an option).
          // Thus the arrow will slide up or down then disappear when it hits the arrowPadding
          // threshold. This prevents the arrow from looking broken when it slides of the content.
          arrowPadding={10}
          className={`radix-dropdown-content${
            contentClassName ? ` ${contentClassName}` : ''
          }`}
          style={contentStyle}
          sideOffset={sideOffset}
          side={side}
        >
          {children}

          {arrow && (
            <DropdownMenu.Arrow
              // You could do this, but using the style prop instead allows it to be configured by consumer.
              // width={20}
              // height={8}
              className={`radix-dropdown-arrow${
                arrowClassName ? ` ${arrowClassName}` : ''
              }`}
              style={{
                width: 20,
                height: 8,
                top: -2.5,
                position: 'relative',
                ...arrowStyle
              }}
            />
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
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

// Omitted: DropdownMenu.Root, DropdownMenu.Trigger, DropdownMenu.Content, DropdownMenu.Arrow
const CompoundComponent = Object.assign(RadixDropdown, {
  clampMaxWidthToViewport: clampMaxWidthToViewport,
  Portal: DropdownMenu.Portal,
  Item: DropdownMenu.Item,
  Sub: DropdownMenu.Sub,
  SubTrigger: DropdownMenu.SubTrigger,
  SubContent: DropdownMenu.SubContent,
  Separator: DropdownMenu.Separator,
  CheckboxItem: DropdownMenu.CheckboxItem,
  ItemIndicator: DropdownMenu.ItemIndicator,
  Label: DropdownMenu.Label,
  RadioGroup: DropdownMenu.RadioGroup,
  RadioItem: DropdownMenu.RadioItem,
  Group: DropdownMenu.Group
})

export { CompoundComponent as RadixDropdown }
