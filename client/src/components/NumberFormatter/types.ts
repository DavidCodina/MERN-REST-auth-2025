import { ComponentPropsWithoutRef } from 'react'

export interface NumberFormatterProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'defaultValue'> {
  /** Value to format */
  value?: number | string
  defaultValue?: string | number

  /** react-number-format defaults to `input`. Mantine defaults to `text`. */
  displayType?: 'text' | 'input'

  /** Determines whether negative values are allowed, `true` by default.
   * If you pass a negative when `allowNegative={false}`, it will convert it to a positive.
   */
  allowNegative?: boolean

  /** Limits the number of digits that are displayed after the decimal point, by default there is no limit */
  decimalScale?: number

  /** Character used as a decimal separator, `'.'` by default */
  decimalSeparator?: string

  /** If set, 0s are added after `decimalSeparator` to match given `decimalScale`. `false` by default */
  fixedDecimalScale?: boolean

  /** Prefix added before the value */
  prefix?: string

  /** Suffix added after the value */
  suffix?: string

  /** Defines the thousand grouping style */
  thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan' | 'none'

  /** A character used to separate thousands, `','` by default */
  thousandSeparator?: string | boolean
}
