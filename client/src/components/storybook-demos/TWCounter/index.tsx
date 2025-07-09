import {
  useState,
  useEffect,
  ComponentProps
  // CSSProperties,
  // MouseEventHandler
} from 'react'
import { twMerge } from 'tailwind-merge'

export type Props = Omit<ComponentProps<'button'>, 'children' | 'onClick'> & {
  children?: React.ReactNode | ((count: number) => React.ReactNode)
  onClick?: (count: number) => void
}

// ComponentProps<'button'> already includes the props I've listed below,
// but the more you add explicitly, the better the Storybook documenation will be.
// That said, I think it's cleaner to explicitly define argTypes in the stories.tsx
// files. It's better to separate that concern from the component type.

// & {
//   /** The className to apply to the button. */
//   className?: string
//   /** The CSSProperties style object to apply to the button. */
//   style?: CSSProperties
//   /** A function that will be called when the button is clicked. */
//   onClick?: MouseEventHandler<HTMLButtonElement>
// }

/* ========================================================================
                                TWCounter
======================================================================== */

export const TWCounter = ({
  className,
  onClick,
  children,
  ...otherProps
}: Props) => {
  const [count, setCount] = useState(0)

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(count)
    }

    return children ? children : `Count: ${count}`
  }

  useEffect(() => {
    onClick?.(count)
  }, [count]) // eslint-disable-line

  return (
    <button
      {...otherProps}
      className={twMerge(
        `mx-auto block min-w-[150px] rounded-lg border border-blue-700 bg-blue-500 px-2 py-1 font-bold text-white dark:border-2 dark:border-red-500`,
        className
      )}
      onClick={(_e) => setCount((v) => v + 1)}
    >
      {renderChildren()}
    </button>
  )
}
