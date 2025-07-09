// Third-party imports
import { CSSProperties, ReactNode, forwardRef } from 'react'

// Custom imports
import { useThemeContext } from 'contexts'
import { twMerge } from 'tailwind-merge'
import './index.css'

/* ========================================================================
                              Tooltip
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Tooltip is a dumb component designed specifically to work with
// usePopperTooltip from react-popper-tooltip (see ToolTipDemo.tsx).
//
//   https://www.npmjs.com/package/react-popper-tooltip
//
// react-popper-tooltip is a much better solution than tippy because you can connect it via ref.
// react-popper-tooltip is built on top of React Popper, and seems strongly influenced
// by Tanner Linsley's coding style.
//
// That said, there's a lot of logic that always needs to happen on the consuming side, that
// makes the overall implementation kind of clunky -especially if you need to create multiple
// tooltips. Also, I noticed a bug with popperOptions.onFirstUpdate function that results
// in an infinite render.
//
// react-popper-tooltip is probably best when your third-party UI library does
// not have a solution of its own. I'm probably more inclined to reach for Radix UI,
// rather than doing this. Also, the nice thing about Radix primitives is that
// they have incremental adoption: https://www.radix-ui.com/primitives/docs/overview/introduction#incremental-adoption
// This means that each primitive can be installed on its own.
//
// Currently, there is still a CSS stylesheet associated with this component.
// We could completely remove the stylesheet and instead use 'arbitrary variants'
// to target nested elements.
//
//   <div className={`mx-auto my-5 w-[160px] rounded-xlbg-red-500 p-5 [&>div]:bg-orange-500 [&>div]:p-5 [&_.yellow]:bg-yellow-500 [&_.yellow]:p-5 [&_[data-green=true]]:bg-green-500 [&_[data-green=true]]:p-5`}>
//     <div>
//       <div className='yellow'>
//         <div data-green='true'></div>
//       </div>
//     </div>
//   </div>
//
// That said, it gets a little nuts  trying to  write out all the styles like that.
// So for now, I'm NOT going to go that route.
//
// Ideally, any component that uses ToolTip / react-popper-tooltip will be able
// to accept refs. However, if for some reason you have a component that does NOT
// accept refs, you can wrap it in a container:
//
//   <div
//     className='mx-auto flex w-[150px] justify-center'
//     ref={setTriggerRef}
//   >
//     <ButtonWithNoRef color='green' size='sm'>Tooltip Button</ButtonWithNoRef>
//   </div>
//
///////////////////////////////////////////////////////////////////////////

interface IToolTip {
  background?: string
  borderColor?: string
  className?: string
  children: ReactNode
  getArrowProps: any
  getTooltipProps: any
  ref?: HTMLElement | null | undefined
  style?: CSSProperties
  visible?: boolean
}

// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/
// Was doing: export const ToolTip = forwardRef({ ... }: IToolTip, ref: : React.Ref<HTMLDivElement>) => {...}
// which also seems to work: https://blog.logrocket.com/use-forwardref-react/
export const ToolTip = forwardRef<HTMLDivElement, IToolTip>(
  (
    {
      background = '',
      borderColor = '',
      children,
      className = '',
      visible,
      getTooltipProps,
      getArrowProps,
      style = {}
    },
    ref
  ) => {
    const { mode } = useThemeContext()
    /* ======================
          return
    ====================== */

    if (!visible || !children) {
      return null
    }

    return (
      <div
        ref={ref}
        {...getTooltipProps({
          style: {
            '--tooltipBackground': background
              ? background
              : mode === 'dark'
                ? 'var(--dark-bg-color)'
                : '',

            '--tooltipBorder': borderColor
              ? borderColor
              : mode === 'dark'
                ? 'var(--dark-primary-color)'
                : '',
            ...style
          } as CSSProperties,

          // Note: z-[1040], so that ToolTips will be below the Side Menu's backdrop.
          className: twMerge(
            `
        xx-tooltip-container
        flex
        flex-col
        flex-wrap
        duration-500
        bg-white 
        text-xs
        p-1
        border
        max-w-[300px]
        rounded
        shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        transition-opacity
        z-[1040]
      `,
            className
          )
        })}
      >
        <div {...getArrowProps({ className: 'xx-tooltip-arrow', style: {} })} />

        {children}
      </div>
    )
  }
)

export default ToolTip
