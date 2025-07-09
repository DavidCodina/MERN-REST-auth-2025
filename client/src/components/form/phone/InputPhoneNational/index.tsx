import React, {
  useId,
  forwardRef,
  useState,
  useEffect,
  CSSProperties
} from 'react'
// The default component exported from this package is a phone number <input/> with a country <select/>.
// If you want a national-only version (i.e., no country <select>) then use the '/input' version.
import { getCountryCallingCode } from 'react-phone-number-input'
import PhoneInput from 'react-phone-number-input/input'
import flags from 'react-phone-number-input/flags'

export { getCountryNameFromCountryCode } from '../utils'
import { IInputPhoneNational } from './types'
import { CountryCode } from '../types'
import '../style.css'

export type { CountryCode }

/* =============================================================================
                                  InputPhoneNational
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

export const InputPhoneNational = forwardRef<
  HTMLInputElement,
  IInputPhoneNational
>(
  (
    {
      className = '',
      country = 'US',
      defaultValue,
      disabled = false,
      // Defaulting to true for enableFallbackInput seems like a sensible decision.
      // Note: This only is applicable when !international.
      enableFallbackInput = true,
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

    // Initially, there was no need for internalValue.
    // However, with the uncontrolled fallback input, we needed a way of
    // switching from useFallbackInput to !useFallbackInput and that
    // necessitated actually tracking the value internally.
    const [internalValue, setInternalValue] = useState(value)

    /* ======================
        useFallbackInput 
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // useFallbackInput - Derived state
    //
    // When enableFallback prop is true, then this IIFE checks value.
    // If value is a non-empty string, but not in E.164 format, then
    // it will return true. This tells renderInput() to use the
    // fallback <input type='tel' />.
    //
    ///////////////////////////////////////////////////////////////////////////

    const useFallbackInput = (() => {
      if (
        !country ||
        typeof country !== 'string' ||
        enableFallbackInput !== true ||
        typeof internalValue !== 'string' ||
        internalValue.trim().length === 0
      ) {
        return false
      }

      const countryCallingCode = getCountryCallingCode(country)

      if (!countryCallingCode) {
        return false
      }

      const isE164Number = new RegExp(`^\\+${countryCallingCode}\\d*$`).test(
        internalValue
      )

      if (isE164Number) {
        return false
      }

      return true
    })()

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
          handleBlur()
    ====================== */

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e)
    }

    /* ======================
          useEffect()
    ====================== */
    // This useEffect() watches for changes to value.
    // It then updates the internalValue if needed.

    useEffect(() => {
      if (value === internalValue) {
        return
      }
      setInternalValue(value || '')
    }, [
      value,
      // Including internalValue in the dependency array when internalValue is also set in
      // the useEffect() could lead to an infinite loop, but only if it was a reference type.
      internalValue
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
          renderFlag()
    ====================== */
    // https://gitlab.com/catamphetamine/react-phone-number-input#flags-url

    const renderFlag = () => {
      // import flags from 'react-phone-number-input/flags'
      // Type any is used here because the actual type only has a title prop.
      // However, we can actually still pass other props to it.

      if (country && typeof country === 'string') {
        const FlagComponent: any = flags[country]

        if (FlagComponent) {
          return (
            <FlagComponent
              className='PhoneInputCountryIcon PhoneInputCountryIcon--border'
              style={{
                position: 'absolute',
                top: '50%',
                left: 8,
                transform: 'translateY(-50%)'
              }}
              title={country || 'Country Flag'}
            />
          )
        }
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // An alternate way of getting the flag would be to do this, which is
      // essentially what the FlagComponent does. The only danger here is if
      // the library decides to change the URL location of its flag images.
      //
      // return (
      //   <div
      //     className='PhoneInputCountryIcon PhoneInputCountryIcon--border'
      //     style={{
      //       position: 'absolute',
      //       top: '50%',
      //       left: 8,
      //       transform: 'translateY(-50%)'
      //     }}
      //   >
      //     <img
      //       className='PhoneInputCountryIconImg'
      //       alt={country || 'Country Flag'}
      //       src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
      //     />
      //   </div>
      // )
      //
      /////////////////////////

      return null
    }

    /* ======================
         renderInput()
    ====================== */

    const renderInput = () => {
      const paddingLeft = (() => {
        if (size === 'sm') {
          return 40
        } else if (size === 'lg') {
          return 60
        }
        return 48
      })()

      if (useFallbackInput) {
        return (
          <>
            {/* <div className='text-sm font-bold text-rose-500'>Fallback...</div> */}
            <input
              {...otherProps}
              autoComplete='off'
              className={getClassName()}
              disabled={disabled}
              onBlur={handleBlur}
              onChange={(e) => {
                const newValue = e.target.value || ''
                setInternalValue(newValue)
                onChange?.(newValue)
              }}
              placeholder={placeholder}
              style={{ paddingLeft: paddingLeft, ...style }}
              ref={ref}
              type='tel'
              value={internalValue}
            />
          </>
        )
      }

      // Otherwise return PhoneInput
      return (
        <>
          <PhoneInput
            {...otherProps}
            autoComplete='off'
            className={getClassName()}
            country={country || undefined} // Must be type CountryCode | undefined
            disabled={disabled}
            onBlur={handleBlur}
            onChange={(value) => {
              setInternalValue(value || '')
              // When the value is empty in the PhoneInput, it passes back undefined.
              // This is a poor design choice. Instead, we always want to pass back ''.
              onChange?.(value || '')
            }}
            placeholder={placeholder}
            ref={ref}
            style={{ paddingLeft: paddingLeft, ...style }}
            // No need to set type='tel'
            // Typescript won't complain if you pass in a defaultValue, but PhonInput won't use it.
            // ❌ defaultValue={ ... }
            value={internalValue}
          />
        </>
      )
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

        <div className='relative'>
          {renderInput()}
          {renderFlag()}
        </div>

        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)
