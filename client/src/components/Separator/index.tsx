import { forwardRef } from 'react'

const DEFAULT_ORIENTATION = 'horizontal'
const ORIENTATIONS = ['horizontal', 'vertical'] as const

type Orientation = (typeof ORIENTATIONS)[number]
type SeparatorRef = HTMLDivElement

export interface SeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
  /**  Either `vertical` or `horizontal`. Defaults to `horizontal`. */
  orientation?: Orientation
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean
}

//# Create a plugin for this, which will actually make the Separator easier to update with utility classes
//# without having to use Tailwind Merge.

const defaultClassName = `bg-white data-[orientation=horizontal]:my-4 data-[orientation=horizontal]:h-px data-[orientation=vertical]:mx-4 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px`

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation)
}

/* ========================================================================
                              Separator
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Taken from Radix:
//
//   https://www.radix-ui.com/primitives/docs/components/separator
//   https://github.com/radix-ui/primitives/blob/main/packages/react/separator/src/Separator.tsx
//
// Usage:
//
//   const separatorStyle = `bg-white data-[orientation=horizontal]:my-4 data-[orientation=horizontal]:h-px data-[orientation=vertical]:mx-4 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px`
//   ...
//   <Separator className={separatorStyle} />
//
// What benefit does this component actually confer?
//
//   Most of the heavy-lifting is done by the Tailwind styling, so why do
//   we need this at all? It adds 'role' and/ 'aria-orientation' labeling based
//   on the value of the decorative prop. That's pretty much it. However, with the
//   styles baked in, it allows for a quick and easy way to create a vertical separator.
//
//   The Mantine Divider component is actually much more sophisticated: https://v1.mantine.dev/core/divider
//   It allows for a text to be placed left/right/center within the divider.
//   We could probably accomplish something similar by passing in text that
//   gets wrapped in a <span> that then does some positioning and masking.
//
///////////////////////////////////////////////////////////////////////////

export const Separator = forwardRef<SeparatorRef, SeparatorProps>(
  (
    {
      decorative,
      orientation: orientationProp = DEFAULT_ORIENTATION,
      className = defaultClassName,
      ...otherProps
    },
    forwardedRef
  ) => {
    const orientation = isValidOrientation(orientationProp)
      ? orientationProp
      : DEFAULT_ORIENTATION

    // 'aria-orientation' defaults to 'horizontal' so we only need it if `orientation` is vertical
    const ariaOrientation = orientation === 'vertical' ? orientation : undefined

    const semanticProps = decorative
      ? { role: 'none' }
      : { 'aria-orientation': ariaOrientation, role: 'separator' }

    /* ======================
            return
    ====================== */

    return (
      <div
        className={className}
        data-orientation={orientation}
        {...semanticProps}
        {...otherProps}
        ref={forwardedRef}
      />
    )
  }
)

Separator.displayName = 'Separator'
