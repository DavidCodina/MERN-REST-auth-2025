import { CountryCode, E164Number } from '../types'

// props are omitted either because we don't want the consumer to be able
// to pass them, or because they are redefined within the interface.
export interface IInputPhoneInternational
  extends Omit<
    React.ComponentProps<'input'>,
    | 'autoComplete'
    // Use custom defaultValue instead that is ONLY type string.
    | 'defalaultValue'
    | 'disabled'
    | 'onBlur'
    | 'onChange'
    | 'size'
    // Prohibit consumer from chaning the type.
    | 'type'
    // By default, PhoneInput types value as: string | number | readonly string[]
    // I prefer to be more restrictive for now.
    | 'value'
  > {
  countries?: CountryCode[]
  country?: CountryCode | ''
  defaultValue?: string
  disabled?: boolean
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
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void
  onChange?: (value: E164Number) => void
  onCountryChange?: (country: CountryCode | '') => void
  size?: 'sm' | 'lg'
  touched?: boolean

  // This is optional because the consumer can also choose to use defaultValue.
  value?: string
}
