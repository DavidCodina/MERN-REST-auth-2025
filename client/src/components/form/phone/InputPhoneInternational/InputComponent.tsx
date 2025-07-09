import { forwardRef } from 'react'

type InputProps = any
type InputRef = HTMLInputElement

/* =============================================================================
                                InputComponent
============================================================================= */
// A custom component passed as inputComponent={InputComponent}.
// This allows us to pass in inputStyle and inputClassName props
// when using the international version.

export const InputComponent = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    className = '',
    inputStyle = {},
    inputClassName = '',
    ...otherProps
  } = props

  //! Why are we adding className AND inputClassName?
  return (
    <input
      {...otherProps}
      ref={ref}
      className={` ${className} ${inputClassName ? ` ${inputClassName}` : ''}`}
      style={inputStyle}
    />
  )
})

InputComponent.displayName = 'InputComponent'
