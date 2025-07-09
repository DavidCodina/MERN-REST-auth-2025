// Custom imports
import {
  CSSProperties,
  ComponentProps,
  ElementType,
  forwardRef,
  ForwardedRef,
  ReactNode
} from 'react'
import { useThemeContext } from 'contexts'
import { twMerge } from 'tailwind-merge'

// https://levelup.gitconnected.com/create-more-extensible-react-components-with-the-as-prop-pattern-b79bcbcf4024
// https://stevekinney.github.io/react-and-typescript/polymorphic-components

type TitleOwnProps<T extends ElementType = ElementType> = {
  as?: T
  color?: string
}

// TitleProps includes everything in TitleOwnProps & combines that with
// everything that is in the React component the E represents, minus
// the ones that we define.
type TitleProps<U extends ElementType> = TitleOwnProps<U> &
  Omit<ComponentProps<U>, keyof TitleOwnProps>

// Why are we also doing this? When assigned to the function definition
// below, this is what will prevent the consumer from adding props/attributes
// to the component that aren't part of the element's normal props.
// For example if as='h2', you can't add a value prop.
type TitleComponent = <C extends ElementType = typeof defaultElement>(
  props: TitleProps<C>
) => ReactNode

const defaultElement = 'h1'

/* =============================================================================
                                  Title
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// Initially, this syntax was used:
//
//   export function Title<E extends ElementType = typeof defaultElement>(props: TitleProps<E>) { ... }
//
// But then switched to this in order to implement the forwardRef:
//
//   export const Title = forwardRef(<E extends ElementType = typeof defaultElement>(props: TitleProps<E>,ref: ForwardedRef<any>) => { ... }
//
// The React.ForwardedRef type is what glues it all together. In previous polymorphic
// implementations with forwardRef I followed this implementation, which gets way too complex:
// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/
//
////////////////////////////////////////////////////////////////////////////////

export const Title: TitleComponent = forwardRef(
  <E extends ElementType = typeof defaultElement>(
    props: TitleProps<E>,
    ref: ForwardedRef<any>
  ) => {
    const { mode } = useThemeContext()

    // Initially, I tried destructuring from within the function args, but
    // Typescript gets confused about Component.
    const {
      as: Component = defaultElement,
      children,
      color: _color = '',
      className = '',
      style = {},
      ...otherProps
    } = props

    // In this case, it just so happens that I want the same default color when light/dark.
    const color = _color
      ? _color
      : mode === 'dark'
        ? 'var(--dark-primary-color)'
        : 'var(--dark-primary-color)'

    /* ======================
        getClassName()
  ====================== */

    const getClassName = () => {
      const base = `
      m-0
      dark:text-(--dark-bg-color)
      text-white 
      font-black 
      tracking-[1px]
      leading-none
      uppercase
      font-['Poppins']
      transition-[background-color,color,text-shadow]
      duration-300
      ease-linear
    `

      const _className = twMerge(base, className)

      return _className
    }

    /* ======================
          return
  ====================== */

    return (
      <Component
        className={getClassName()}
        ref={(node) => {
          if (ref && 'current' in ref) {
            ref.current = node
          } else if (typeof ref === 'function') {
            ref?.(node)
          }
        }}
        style={
          {
            // If the user explicitly passes in a color, then it will be used always.
            // If they want it to change based on mode, then they need to handle that
            // on the consuming side.
            WebkitTextStrokeColor: color,
            WebkitTextStrokeWidth: 1,
            textShadow:
              mode === 'dark'
                ? `
        0 1px 0 hsl(217, 0%, 20%), 
        0 2px 0 hsl(217, 0%, 19%),
        0 3px 0 hsl(217, 0%, 18%), 
        0 4px 0 hsl(217, 0%, 17%),
        0 5px 0 hsl(217, 0%, 16%), 
        0 6px 0 hsl(217, 0%, 15%),
        0 7px 0 hsl(3217, 0%, 14%), 
        0 8px 0 hsl(217, 0%, 14%),
        0px 10px 2px rgba(16, 16, 16, 0.2),
        0px 12px 4px rgba(16, 16, 16, 0.2)
        `
                : `
        0 1px 0 hsl(174, 5%, 86%),
        0 2px 0 hsl(174, 5%, 84%),
        0 3px 0 hsl(174, 5%, 82%),
        0 4px 0 hsl(174, 5%, 80%),
        0 5px 0 hsl(174, 5%, 78%),
        0 6px 0 hsl(174, 5%, 76%),
        0 7px 0 hsl(174, 5%, 74%),
        0 8px 0 hsl(174, 5%, 72%),
        0 9px 0 ${color},
        0px 10px 2px rgba(16, 16, 16, 0.2),
        0px 12px 4px rgba(16, 16, 16, 0.2)
        `,
            ...style
          } as CSSProperties
        }
        {...otherProps}
      >
        {children}
      </Component>
    )
  }
)
