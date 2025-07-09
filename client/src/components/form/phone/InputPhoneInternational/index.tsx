import React, {
  CSSProperties,
  useState,
  useId,
  forwardRef,
  useEffect
} from 'react'
///////////////////////////////////////////////////////////////////////////
//
// The default component exported from this package is a phone number <input/> with a country <select/>.
// You could call the default export PhoneInput, which is what the docs do, but that's confusing.
// A better name for this component is PhoneInputInternational.
// If instead you you want a PhoneInput WITHOUT a country <select/>,
// then you need import from  'react-phone-number-input/input'
// That version is used in the InputPhoneNational component.
//
///////////////////////////////////////////////////////////////////////////

// { getCountryCallingCode,  isPossiblePhoneNumber, formatPhoneNumber, formatPhoneNumberIntl }
import PhoneInputInternational from 'react-phone-number-input'

// Custom imports
import { InputComponent } from './InputComponent'
import { IInputPhoneInternational } from './types'
import { CountryCode } from '../types'
import '../style.css'

export { getCountryNameFromCountryCode } from '../utils'
export type { CountryCode }

/* =============================================================================
                                InputPhoneInternational
============================================================================= */
// InputPhoneNational and InputPhoneInternational were originally a single component
// with props to support both implementations. The advantage there was to keep it DRY.
// However, the two versions are sufficiently nuanced that dividing them into two separate
// components is much less convoluted.

// https://gitlab.com/catamphetamine/react-phone-number-input
// https://catamphetamine.gitlab.io/react-phone-number-input/
// https://catamphetamine.gitlab.io/react-phone-number-input/docs/index.html#phoneinputwithcountry
// https://github.com/catamphetamine/react-phone-number-input
// Props: https://catamphetamine.gitlab.io/react-phone-number-input/docs/index.html#phoneinputwithcountry

export const InputPhoneInternational = forwardRef<
  HTMLInputElement,
  IInputPhoneInternational
>(
  (
    {
      className = '',
      countries, // Used when international prop is true.
      country = '',
      defaultValue,
      disabled = false,
      error,
      formGroupClassName = '',
      formGroupStyle = {},
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      id,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},
      onBlur,
      onChange,
      onCountryChange,
      placeholder = '',
      size,
      style = {},
      touched,
      value: controlledValue,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
          constants
    ====================== */

    // Merge controlledValue and defalaultValue into value.
    // This could go wrong if for some reason the consumer passes in both
    // a value and a defaultValue. Then whenever the value was '', the
    // defaultValue would kick in - that would be bad!
    const value = controlledValue || defaultValue || ''

    const uuid = useId()
    id = id || uuid

    /* ======================
          state & refs
    ====================== */

    // internalCountry is passed to react-phone-number-input as defaultCountry={internalCountry || undefined}
    // If internalCounrtry is '', we set it to undefined because it expects CountryCode | undefined.
    // setInternalCountry is implemented in react-phone-number-input's onCountryChange.
    // setInternalCountry is implemented in the useEffect that watches for changes to the country prop.
    const [internalCountry, setInternalCountry] = useState<CountryCode | ''>(
      () => {
        return country || ''
      }
    )

    /* ======================
          getClassName() 
    ====================== */

    const getClassName = () => {
      let classes = 'form-control'

      ///////////////////////////////////////////////////////////////////////////
      //
      // This configuration is important. If there is an error, then
      // ALWAYS implement .is-valid. However, if there is no error then ONLY
      // implement .is-valid if touched is true. This makes it so the component
      // can be used without passing in touched and not have an immediate success green.
      // Note also that the component works best when react-hook-form mode is set to 'onTouched'.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (error) {
        classes = `${classes} is-invalid`
      } else if (!error && touched) {
        classes = `${classes} is-valid`
      }

      if (size === 'sm') {
        classes = `${classes} form-control-sm`
      } else if (size === 'lg') {
        classes = `${classes} form-control-lg`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
          useEffect()
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // This useEffect() watches for changes to the country prop.
    // It then updates the internalCountry if needed.
    //
    // Conversely, we want to be able to update the country prop when internalCountry changes.
    // We could do that in another useEffect(). However, react-phone-number-input exposes an
    // onCountryChange() callback prop that we can use instead.
    //
    ///////////////////////////////////////////////////////////////////////////

    useEffect(() => {
      if (country === internalCountry) {
        return
      }

      setInternalCountry(country || '')
    }, [
      country,
      // Including internalCountry in the dependency array when internalCountry is also set in
      // the useEffect() could lead to an infinite loop, but only if it was a reference type.
      internalCountry
    ])

    /* ======================
        renderLabel() 
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={id}
            className={`form-label${labelClassName ? ` ${labelClassName}` : ''}`}
            style={{
              ...labelStyle,
              ...(disabled ? { color: 'var(--form-disabled-color)' } : {})
            }}
          >
            {label}{' '}
            {labelRequired && (
              <sup
                className=''
                style={{
                  color: disabled ? 'inherit' : 'var(--form-invalid-color, red)'
                }}
              >
                *
              </sup>
            )}
          </label>
        )
      }
      return null
    }

    /* ======================
        renderFormText() 
    ====================== */

    const renderFormText = () => {
      if (formText) {
        return (
          <div
            className={`form-text${
              formTextClassName ? ` ${formTextClassName}` : ''
            }`}
            style={formTextStyle}
          >
            {formText}
          </div>
        )
      }

      return null
    }

    /* ======================
          renderError() 
    ====================== */

    const renderError = () => {
      if (error) {
        return <div className='invalid-feedback block'>{error}</div>
      }
      return null
    }

    /* ======================
            return
    ====================== */

    return (
      <div
        className={formGroupClassName}
        style={
          {
            '--PhoneInputCountryFlag-height':
              size === 'sm' ? '1em' : size === 'lg' ? '1.85em' : '1.25em',
            ...formGroupStyle
          } as CSSProperties
        }
      >
        {renderLabel()}

        <PhoneInputInternational
          {...otherProps}
          autoComplete='off'
          // react-phone-number-input looks like garbage when international + disabled.
          // Internally, the flags are removed and the <select> looks real bad.
          // In order to fix this, it's better to just hide that group.

          className={disabled ? '[&_.PhoneInputCountry]:hidden' : ''}
          // If specified, only these countries will be available for selection.
          countries={countries}
          ///////////////////////////////////////////////////////////////////////////
          //
          // This prop is misnamed. It's not really the default starting country.
          // Nor is it an initial country for uncontrolled implementations.
          // In fact, if you had a defaultCountry of 'US', but began with a value
          // of '+441782830038', the component would immediately infer a countryCode of 'GB'.
          //
          // This prop actually specifies a fallback country that is used instead of
          // switching to the generic international (i.e., undefined) version of the input
          // when attempting to dynamically infer the country from the value.
          //
          // What we actually want to do is set this as a controlled value through a two-way binding
          // that works in conjunction with the onCountryChange() prop. In fact, we NEED to do this.
          // Otherwise, the countryCode inference dynamically changes as we're typing a value.
          //
          ///////////////////////////////////////////////////////////////////////////
          defaultCountry={internalCountry || undefined}
          disabled={disabled}
          id={id}
          // By default, an initial value of '+12065554433' or typing '+12065554433'
          // will render as: '+1 206 555 4433'. Setting initialValueFormat='national'
          // will attempt to format it to: '(206) 555-4433'.
          // None of this affects the raw value. Moreover, if react-phone-number input
          // infers that the raw value is not consistent with the national number format, then
          // the formatting will be skipped.
          initialValueFormat='national'
          // These props are custom and will be passed into the InputComponent.
          // Internally, InputComponent destructures them from props and passes
          // them as the value to the associated className and style. Otherwise,
          // it would result in a React error.
          inputClassName={getClassName()}
          inputComponent={InputComponent}
          inputStyle={{
            paddingLeft: (() => {
              if (disabled === true) {
                return 10
              }
              if (size === 'sm') {
                return 56
              } else if (size === 'lg') {
                return 80
              }
              return 64
            })(),
            ...style
          }}
          // This is does not make the phone input render with/without the country select.
          // Rather, it determines whether the component should use internation format or not.
          // In other words, whether to show the '+' and countryCallingCode.
          international={false}
          onBlur={onBlur}
          onChange={(value) => {
            // When the value is empty in the PhoneInput, it passes back undefined.
            // This is a poor design choice. Instead, we always want to pass back ''.
            onChange?.(value || '')
          }}
          // onChange() is actually also called when the user selects a country.
          // However, it fires BEFORE setCountryCode(country) is able to complete
          // in the onCountryChange() below. This means the countryCallingCode and
          // countryCode values below will still be empty strings at this point.
          onCountryChange={(country: CountryCode) => {
            // react-phone-number-input's onCountryChange can potentially pass
            // back undefined, but we always want '' instead.
            setInternalCountry(country || '')

            ///////////////////////////////////////////////////////////////////////////
            //
            // If we passed in an onCountryChange callback, then call that with the country arg.
            // Then in the consuming component, we can set the country state. That would
            // likely get passed back into this component at which point the associated
            // useEffect() would check the value of the country prop. If it differs from
            // the internalCountry, then we'd update the internalCountry.
            //
            // In most cases, the internalCountry will already be the same as the country prop and
            // return early. However, after submitting a form, we may choose to update the country
            // prop to '', 'US', or some other value. In that case, the associated useEffect()
            // WILL update internalCountry.
            //
            // Our custom onCountryChange differs from the react-phone-number-input version in that
            // we pass back '' instead of undefined.
            //
            ///////////////////////////////////////////////////////////////////////////
            onCountryChange?.(country || '')
          }}
          placeholder={placeholder}
          ref={ref as React.Ref<any>}
          style={{}} // Applied to the input wrapper: <div className="PhoneInput">
          // Typescript won't complain if you pass in a defaultValue, but PhonInput won't use it.
          // ❌ defaultValue={ ... }
          value={value}
        />

        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)
