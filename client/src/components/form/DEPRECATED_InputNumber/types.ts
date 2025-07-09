export type IInputNumber = {
  allowNegative?: boolean
  allowDecimal?: boolean
  // Controls how value is clamped.
  //
  //  'blur'   : user is allowed to enter any values, but the value is clamped when the input loses focus (default behavior),
  //  'strict' : user is not allowed to enter values that are not in `[min, max]` range,
  //#  'none'   : lifts all restrictions, `[min, max]` range is applied only for controls and up/down keys */
  //
  // By default, the value is clamped when the input is blurred.
  // If you set clampBehavior="strict", it will not be possible to enter value outside of min/max range.
  // Note that this option may cause issues if you have tight min and max,
  // for example min={10} and max={20}.
  // If you need to disable value clamping entirely, set clampBehavior="none".

  clampBehavior?: 'blur' | 'strict' | 'none'

  /** decimalScale controls how many decimal places are allowed: */
  decimalScale?: number
  fixedDecimalScale?: boolean
  // Mantine also has a thousandsGroupStyle prop that accepts: thousand, lakh, wan, none values.
  // I did not add that feature in...

  /** A single character. If it's not a single character, it will interfere with how
   * onKeyDown skips over the separator when typing it or backspacking. For now, the
   * type has been limited to the following string literals.
   */
  thousandSeparator?: ',' | '|' | '/' | '*'

  // was number only, but then react-hook form complains when you spread its props.
  //! min?: number
  //! max?: number

  error?: string

  formGroupClassName?: string
  formGroupStyle?: React.CSSProperties

  formText?: string
  formTextClassName?: string
  formTextStyle?: React.CSSProperties
  label?: string // Could be React.ReactNode, but string is okay for now.

  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: React.CSSProperties
  size?: 'sm' | 'lg'

  //# step?: number | 'any'
  touched?: boolean
  /** string only */
  value?: string
} & Omit<
  React.ComponentProps<'input'>,
  'size' | 'type' | 'value' //! | 'min' | 'max'
>
