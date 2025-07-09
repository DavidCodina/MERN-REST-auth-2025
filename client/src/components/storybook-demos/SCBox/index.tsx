import { ComponentProps } from 'react'

type SCBoxProps = {
  /** The color to set as the background when hovered. */
  hoverColor?: string
  className?: string
  css?: string
} & ComponentProps<'div'>

/* ========================================================================
                                SCBox
======================================================================== */
// This is merely to manual test the Storybook / Styled Components implementation.

/** This is the default description as defined immediately above the actual component. */
export const SCBox = ({
  hoverColor = '#50BFE6',
  className,
  css = '',
  ...otherProps
}: SCBoxProps) => {
  css = css
    ? css
    : `
  background-color: #ccc;
  border-radius: 10px;
  &:hover {
    background-color: ${hoverColor};
    cursor: pointer;
  }
`
  return (
    <div
      className={`h-24 w-24 border border-black${className ? ` ${className}` : ''}`}
      css={css}
      {...otherProps}
    />
  )
}
