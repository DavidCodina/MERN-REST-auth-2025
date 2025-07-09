import { forwardRef, useId } from 'react'
///////////////////////////////////////////////////////////////////////////
//
// https://ndom91.github.io/react-timezone-select/
// https://github.com/ndom91/react-timezone-select
// https://github.com/ndom91/react-timezone-select#-timezone-hook
// By default, react-timezone-select (i.e., TimezoneSelect component) uses react-select as underlying
// select component. If you'd like to bring your own select component, you can use the useTimezoneSelect hook
// instead of the TimezoneSelect component to render the timezones using your self-provided select component.
//
// Gotcha, even if you're using a custom select, it seems like you still may
// need to install react-select, just to prevent a 'Module not found' error.
//
///////////////////////////////////////////////////////////////////////////

import {
  useTimezoneSelect
  ///////////////////////////////////////////////////////////////////////////
  //
  // The library is way too wide with the type definition of allTimezones.
  // allTimezones -> declare const allTimezones: ICustomTimezone -> type ICustomTimezone = { [key: string]: string; };
  // The rationale was probably allow the consumer to optionally define their own timezone dictionary.
  // //
  // Unfortunately, this makes it very difficult to derive a union type from the keys of the default
  // allTimezones dictionary. Consequently, I copied allTimezones into a local file from the source
  // code here in order to get better type safety.
  // ❌ allTimezones as looselyTypedTimezones
  //
  ///////////////////////////////////////////////////////////////////////////
  // type ITimezone // This is the option type specifically for react-select TimezoneSelect.
} from 'react-timezone-select'

import { isValidTimezone } from './utils'
import { allTimezones as defaultTimezones } from './allTimezones'
import { SelectTimeZoneType, DefaultTimezone } from './types'

/* ========================================================================

======================================================================== */
//# Test multi or potentially omit it.

export type { DefaultTimezone, isValidTimezone }
export const SelectTimeZone = forwardRef(
  (
    {
      className = '',
      /////////////////////////////////////////////////////////////////////////////
      //
      // Note: If you're using react-hook-form, normally the defaultValue is set through
      // the defaultValues object. However, in this case you ALSO need to explicitly pass the
      // defaultValue prop. Why? Because it's used below for various purposes.
      //
      ///////////////////////////////////////////////////////////////////////////
      defaultValue, // Do not default to ''. It will break the prop logic in the JSX.
      disabled = false,
      displayValue = 'GMT',
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
      placeholder = '',
      size,
      style = {},
      timezones = defaultTimezones,
      timezoneLabelStyle = 'original',
      touched,
      value, // Do not default to ''. It will break the prop logic in the JSX.
      ...otherProps
    }: SelectTimeZoneType,
    ref: React.LegacyRef<HTMLSelectElement> | undefined //: React.LegacyRef<HTMLSelectElement> | undefined
    //# Not sure I want to type the ref like this:
  ) => {
    /* ======================
          constants
    ====================== */

    const uuid = useId()
    id = id || uuid

    // Make shallow copy to avoid mutatating the original.
    const internalTimezones: Record<string, string> = { ...timezones }

    ///////////////////////////////////////////////////////////////////////////
    //
    // There are lots of official timezones that are redundant with the ones in allTimezones.
    // For example, 'America/Denver' is not included because it would be redundant with 'America/Boise'.
    // That said, it's still possible to pass in 'America/Denver' then add it to the timezones object.
    //
    //   const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone // e.g., 'America/Denver'
    //
    // When timezones gets passed to useTimezoneSelelect, it will check each timezone in the dictionary to
    // see if it's valid. However, if  it's not a valid timezone, e.g., 'America/Nowhere, then it will not
    // be used.
    //
    // More specifically, if any error occurs during the processing
    // of a timezone (which would happen if the timezone is invalid), the catch block returns null for that timezone,
    // and then it's subsequently filtered out with .filter(Boolean). This effectively removes any timezones
    // that resulted in errors during processing.
    //
    // With this in mind, we can add the intial timezone to internalTimezones if it's not alrady there.
    // However,
    //
    ///////////////////////////////////////////////////////////////////////////

    // This could be wrapped in a preRenderRef, so
    // it only runs once, but it's better for it to always run, just
    // in case the value is intitially passed in asynchronously.

    const val = value || defaultValue || ''
    if (
      typeof val === 'string' &&
      val.trim() !== '' &&
      !(val in timezones) &&
      isValidTimezone(val)
    ) {
      // It will not have a nice label, but it works.
      internalTimezones[val] = val
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Initially, I was doing using this:
    //
    //   parseTimezone(value)?.value || ''
    //
    // to take the value/defaultValue and parse it to get an equivalent timezone.
    // Consequently, if an initial timezone was passed in that's not in the list
    // like 'America/Denver', then parsing on 'America/Denver' resulted in 'America/Boise'.
    //
    // There are two downsides to this approach. First, the allTimezones dictionary
    // covers all zones. However, if the user instead passed in an incomplete list of
    // custom timezones then even if the initial timezone was valid, it might result in ''
    // if no equivalent timezone could be found in the custom timezone dictionary.
    //
    // Second, this approach seems a little too aggressive. I don't want to go
    // changing data. A softer approach is to check if the timeozne is valid and
    // not in the list. If so, just add it (i.e., pass it through).
    //
    ///////////////////////////////////////////////////////////////////////////

    const { options /*, parseTimezone */ } = useTimezoneSelect({
      labelStyle: timezoneLabelStyle, // Default: 'original'
      timezones: internalTimezones,
      displayValue: displayValue // Default: "GMT",
      // currentDatetime,
    })

    /* ======================
          getClassName() 
    ====================== */

    const getClassName = () => {
      let classes = 'form-select'

      if (error) {
        classes = `${classes} is-invalid`
      } else if (!error && touched) {
        classes = `${classes} is-valid`
      }

      if (size === 'sm') {
        classes = `${classes} form-select-sm`
      } else if (size === 'lg') {
        classes = `${classes} form-select-lg`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
          renderLabel() 
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={id}
            className={`form-label${
              labelClassName ? ` ${labelClassName}` : ''
            }`}
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
                  color: disabled ? 'inherit' : 'red'
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
        return <div className='invalid-feedback'>{error}</div>
      }
      return null
    }

    /* ======================
            return
    ====================== */

    return (
      <div className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}
        <select
          className={getClassName()}
          ///////////////////////////////////////////////////////////////////////////
          //
          // Previously, I was always parsing the value, but that's a bad idea.
          // ❌ {...(typeof value === 'string' ? { value: parseTimezone(value)?.value || '' } : typeof defaultValue === 'string' ? { defaultValue: parseTimezone(defaultValue)?.value || '' } : {})}
          //
          // Infer which prop to use based on whether or not it's typeof 'string'.
          // value has precedence over defaultValue. The Typescript SelectTimeZoneType
          // discourages passing in both value and defaultValue through a discriminated union.
          //
          ///////////////////////////////////////////////////////////////////////////
          {...(typeof value === 'string'
            ? { value }
            : typeof defaultValue === 'string'
              ? { defaultValue }
              : {})}
          disabled={disabled}
          id={id}
          ref={ref}
          style={style}
          {...otherProps}
        >
          <option value=''>{placeholder}</option>
          {options.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

SelectTimeZone.displayName = 'SelectTimeZone'
