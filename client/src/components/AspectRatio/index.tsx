import { CSSProperties, forwardRef, LegacyRef, ReactNode } from 'react'

interface IAspectRatio {
  children?: ReactNode
  className?: string
  ratio?: number
  style?: CSSProperties
  // [key: string]: any
}

/* ========================================================================
                                AspectRatio
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Inspiration:
//
//   https://www.radix-ui.com/primitives
//   https://www.radix-ui.com/primitives/docs/components/aspect-ratio
//   https://github.com/radix-ui/primitives/tree/main/packages/react/aspect-ratio/src
//   See also: https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui
//
// However, I put the ref in a different place
// I also baked the container into the component.
// This results in more intuitive consumption in terms of
// styling margin, padding, width, etc.
// Also, in the Radix primitive example, the style and className props were
// assigned to the innermost <div>. This doesn't make any sense to me.
// Instead, I gave them to the top-most <div>. Any styling of the inner
// content can instead be handled in the consuming environment.
//
// Usage:
//
//   <AspectRatio className='mx-auto mb-6' ratio={3 / 1} style={{ maxWidth: 600 }}>
//     <div className='flex h-full items-center justify-center rounded-3xl bg-neutral-800 text-4xl font-black text-white'>
//       3 x 1
//     </div>
//   </AspectRatio>
//
//
// Tailwind does have aspect ratio utilities. I think the benefit of this
// component is that it will work in Safari 14. In other words the CSS
// aspect ratio property does NOT work in Safari 14, but this will.
//
//  https://caniuse.com/mdn-css_properties_aspect-ratio
//
///////////////////////////////////////////////////////////////////////////

export const AspectRatio = forwardRef(
  (props: IAspectRatio, ref: LegacyRef<HTMLDivElement> | undefined) => {
    const {
      children,
      className = '',
      ratio = 1 / 1,
      style = {},
      ...otherProps
    } = props

    /* ======================
          return
  ====================== */

    return (
      <section
        // Add twMerge() here if you ever implement internal Tailwind classes.
        className={className}
        // Radix UI puts ref on innermost <div>. I disagree with that.
        ref={ref}
        style={style}
        {...otherProps}
      >
        <div
          style={{
            // ensures inner element is contained
            position: 'relative',
            // ensures padding bottom trick maths works
            width: '100%',
            paddingBottom: `${100 / ratio}%`
          }}
        >
          <div
            style={{
              // ensures children expand in ratio
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }}
          >
            {children}
          </div>
        </div>
      </section>
    )
  }
)

export default AspectRatio

// AspectRatio.displayName = 'AspectRatio'
