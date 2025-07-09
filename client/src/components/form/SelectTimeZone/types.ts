import { allTimezones as DefaultTimezones } from './allTimezones'

export type DefaultTimezone = keyof typeof DefaultTimezones
export type CustomTimezones = { [key: string]: string }

type BaseSelectTimeZone = {
  children?: React.ReactNode
  displayValue?: 'GMT' | 'UTC'
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
  placeholder?: string
  size?: 'sm' | 'lg'
  // Now I'm also guilty of using the loosely typed timpezone type.
  timezones?: CustomTimezones
  timezoneLabelStyle?: 'original' | 'abbrev' | 'altName' | 'offsetHidden'
  touched?: boolean
} & Omit<React.ComponentProps<'select'>, 'size' | 'defaultValue' | 'value'>

type ControlledSelectTimeZone = BaseSelectTimeZone & {
  value: string
  defaultValue?: never
}

// Discriminated union
type UncontrolledSelectTimeZone = BaseSelectTimeZone & {
  defaultValue: string
  value?: never
}

// This implementation will complain if the user attempts to pass in both value
// and defaultValue. The error message will be cryptic, but it works...
export type SelectTimeZoneType =
  | ControlledSelectTimeZone
  | UncontrolledSelectTimeZone
