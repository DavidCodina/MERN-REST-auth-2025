// Third-party imports
import { ComponentProps } from 'react'

interface IAnchor extends ComponentProps<'a'> {
  disabled?: boolean
  underline?: 'always' | 'hover' | 'never' | ''
}

// Todo: Could add a forwardRef...

// Todo: The focus outline doesn't appear on Firefox.
//# I'm curious if the ring outline would...

/* ========================================================================
                                Anchor
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// To set the color, use Tailwind text-*-* classes when consuming.
// Thus, like Button this is essentially a primitive component.
// What benefit does this component confer?
//
//   - It adds disabled prop/styles (e.g., 'pointer-events-none').
//   - It removes href and onClick when disabled is true.
//   - It removes href when onClick handler is passed.
//   - It bakes in default rel and target attributes.
//   - It adds an underline prop (inspired by Mantine Anchor).
//   - It adds back a tabIndex of 0 even when no href, making the
//     focus-visible:outline-current style work even when the <a>
//     is being used strictly as a click handler, and only removes
//     the tabIndex if disabled.
//   - It dyanamically adds the correct role: role={onClick ? 'button' : 'link'}
//   - It adds onKeyDown to support pressing 'Enter' to trigger the click handler.
//
// Usage:
//
//   <article className='rounded-lg border border-gray-500 bg-white p-4 shadow-lg'>
//     <p>
//       Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis
//       accusantium, molestiae et blanditiis dicta autem. Impedit voluptate
//       officia excepturi reprehenderit! Quo veniam omnis pariatur
//       exercitationem aut totam!{' '}
//       <Anchor
//         // disabled
//         className='font-semibold text-green-500 hover:text-green-600'
//         underline='hover'
//         href='https://www.google.com/'
//         onClick={() => { alert('Note: onClick disables the href.') }}
//       >
//         google.com
//       </Anchor>{' '}
//       Ipsam accusamus dolorem obcaecati perferendis animi autem doloremque
//       nobis. Quas impedit incidunt perspiciatis, dolorem qui fugiat
//       asperiores saepe eligendi temporibus, cum consectetur deleniti?
//     </p>
//   </article>
//
// Usage with buttonPlugin.ts :
//
//   <Anchor
//     // display:table is a hack that allows items to centered
//     // If one used block or flex on an <a> it would expand to full width.
//     className='btn-green btn-sm mx-auto table'
//     underline='never'
//     href='https://www.google.com'
//   >google.com </Anchor>
//
///////////////////////////////////////////////////////////////////////////

export const Anchor = ({
  children,
  className = '',
  disabled,
  href,
  onClick,
  onKeyDown,
  underline = '',
  ...otherProps
}: IAnchor) => {
  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    let classes =
      'cursor-pointer focus-visible:outline-current outline-offset-2 rounded'

    if (underline === 'always') {
      classes = `${classes} underline`
    } else if (underline === 'hover') {
      classes = `${classes} !no-underline hover:!underline`
    } else if (underline === 'never') {
      classes = `${classes} !no-underline`
    }

    if (disabled) {
      classes = `${classes} pointer-events-none opacity-[0.65]`
    }

    if (className) {
      classes = `${classes} ${className}`
    }

    return classes
  }

  /* ======================
          return
  ====================== */

  return (
    <a
      {...(disabled || onClick ? {} : { href })}
      // When no href is present, the default browser behavior is to skip
      // it as focusable. However, we always want it to be focusable as long
      // as !disabled
      {...(disabled ? {} : { tabIndex: 0 })}
      className={getClassName()}
      rel='noopener noreferrer'
      target='_blank'
      // 'Enter' normally works on an <a>'s href. However, it won't automatically work
      // when using <a> strictly to handle a click event. For that reason, we need to
      // manually add the onKeyDown handler.
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.key === 'Enter') {
          onClick?.(e as any)
        }
      }}
      role={onClick ? 'button' : 'link'}
      onClick={
        !onClick || disabled
          ? undefined
          : (e) => {
              e.preventDefault()
              e.stopPropagation()
              onClick(e)
            }
      }
      {...otherProps}
    >
      {children}
    </a>
  )
}
