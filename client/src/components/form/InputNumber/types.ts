import { ComponentProps, SyntheticEvent } from 'react'
import { NumericFormat, NumberFormatValues } from 'react-number-format'

type CustomSourceType = string

type CustomSourceInfo = {
  event?: SyntheticEvent<HTMLInputElement>
  source: CustomSourceType
}

type CustomOnValueChange = (
  values: NumberFormatValues,
  sourceInfo: CustomSourceInfo
) => void

export type Props = {
  allowDecimal?: boolean
  callOnValueChangeOnMount?: boolean
  clampBehavior?: 'none' | 'blur' | 'strict'
  error?: string
  formGroupClassName?: string
  formGroupStyle?: React.CSSProperties
  formText?: string
  formTextClassName?: string
  formTextStyle?: React.CSSProperties
  hideControls?: boolean
  label?: string // Could be React.ReactNode, but string is okay for now.
  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: React.CSSProperties
  onValueChange?: CustomOnValueChange
  prependZero?: boolean
  size?: 'sm' | 'lg'
  step?: number
  stepHoldDelay?: number
  stepHoldInterval?: number
  touched?: boolean
  /** Determines whether up/down keyboard events should be handled to increment/decrement value, `true` by default */
  withKeyboardEvents?: boolean
} & Omit<
  ComponentProps<typeof NumericFormat>,
  'allowNegative' | 'type' | 'displayType' | 'size' | 'OnValueChange'
>

export type Ref = HTMLInputElement
