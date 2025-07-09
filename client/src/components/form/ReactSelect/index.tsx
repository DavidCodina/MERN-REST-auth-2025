import { useId, forwardRef } from 'react'
//# Explore other types
import Select, {
  CSSObjectWithLabel,
  SelectInstance
  // ActionMeta,
  // SingleValue, // Example: const v: SingleValue<{ value: string; label: string }> = {}
  // MultiValue
  // OptionsOrGroups
  // Options
  // PropsValue
  // OnChangeValue
} from 'react-select'

import { IReactSelect, SelectOption } from './types'
export type { SelectOption, SelectInstance }

/* ========================================================================
                               ReactSelect
======================================================================== */
// This component differs from the normal implementation of form fields in that
// almost all of the react-select props are exposed (i.e., isDisabled, etc.).

export const ReactSelect = forwardRef(
  (
    {
      className = '',
      error,
      formGroupClassName = '',
      formGroupStyle = {},
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      inputId,
      instanceId,
      // react-select uses isDisabled instead of disabled.
      // Here, I'm allowing both for convenience but they get merged below.
      isDisabled = false,
      disabled = false,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},
      size,
      style = {},
      touched,
      ...otherProps // value, defaultValue, etc.
    }: IReactSelect,
    // The actual Ref used by react-select is:
    // LegacyRef<Select<unknown, boolean, GroupBase<unknown>>> | undefined
    // We can derive that by doing this:
    //
    //   type SelectRef = React.ComponentProps<typeof Select>['ref']
    //
    // However, if we actually type the ref here in that way, then it makes
    // passing a ref on the consuming side too strict. Instead just do this:
    ref: React.Ref<any> | undefined
  ) => {
    /* ======================
          constants
    ====================== */

    // Merge alias...
    disabled = disabled || isDisabled

    const uuid = useId()

    //# Review inputId and instanceId logic...
    ///////////////////////////////////////////////////////////////////////////
    //
    // The id prop applied to the top-level container.
    // To add an id to the actual input, use the inputId prop.
    // In the case of react-select, this is also the value we
    // want to pass to the label's htmlFor prop.
    //
    ///////////////////////////////////////////////////////////////////////////
    inputId = inputId || uuid

    ///////////////////////////////////////////////////////////////////////////
    //
    // If no instanceId is provided by the consumer, we can add one  in order to avoid the following error:
    // https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
    // next-dev.js:20 Warning: Prop `id` did not match.
    // Server: "react-select-4-live-region" Client: "react-select-3-live-region"
    // By default, this will generate an id of react-select-xxx-input on the associated <input>.
    //
    ///////////////////////////////////////////////////////////////////////////
    instanceId = instanceId || inputId

    /* ======================
          getClassName() 
    ====================== */
    // react-select uses an <input> NOT <select>.

    const getClassName = () => {
      let classes = 'form-control'

      // This  configuration is important. If there is an error, then
      // ALWAYS implement .is-valid. However, if there is no error then ONLY
      // implement .is-valid if touched is true. This makes it so the component
      // can be used without passing in touched and not have an immediate success green.
      // Note also that the component works best when react-hook-form mode is set to 'onTouched'.
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
          renderLabel()  
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={inputId}
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
    //# Alphabetize props.

    return (
      <div className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}

        <Select
          // unstyled
          isDisabled={disabled}
          instanceId={instanceId}
          inputId={inputId}
          classNames={{
            // control is not the top-level container, nor is it the input.
            control: (_state) => {
              return getClassName()
            }
          }}
          ref={ref}
          styles={{
            // This is fine, no modifications are needed
            container: (baseStyles) => {
              return {
                ...baseStyles
              }
            },

            control: (baseStyles, state) => {
              // This is like React.CSSProperties, but you can't type it
              // as that because it also allows for things like '&:hover'.
              // This is because react-select uses emotion internally.
              let styles: CSSObjectWithLabel = {
                ...baseStyles,
                alignItems: 'center',
                backgroundColor: 'var(--form-bg)',
                borderColor: error
                  ? 'var(--form-invalid-border-color)'
                  : !error && touched
                    ? 'var(--form-valid-border-color)'
                    : 'var(--form-border-color)',

                minHeight: 0,
                paddingRight: 5, // Keep this regardless of size of input.
                transition: 'none',
                '&:hover': {
                  // Do this simply to prevent react-select's default
                  // behavior of changing borderColor on hover.
                }
              }

              // Merge consumer style prop into styles
              styles = { ...styles, ...style }

              ///////////////////////////////////////////////////////////////////////////
              //
              // Merge focusStyles into styles when focused. This is a pain, but it's necessary
              // because focus styles are applied programmatically by react-select.
              // Because we're also setting the control className, that will have
              // precedence over settting backgroundColor, borderColor, etc. here.
              // Unless we use !important.
              //
              ///////////////////////////////////////////////////////////////////////////
              if (state.isFocused) {
                const defaultFocusStyles: CSSObjectWithLabel = {
                  backgroundColor: 'var(--form-bg)',
                  borderColor: 'var(--form-focus-border-color)',
                  boxShadow: `0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)`,
                  color: 'var(--form-color)',
                  minHeight: 0, // Must also be here.
                  paddingRight: 5, // Must also be here.
                  outline: 0,
                  '&:hover': {}
                }

                const invalidFocusStyles: CSSObjectWithLabel = {
                  borderColor: 'var(--form-invalid-border-color)',
                  boxShadow: `0 0 0 0.25rem rgba(var(--form-invalid-rgb), 0.25)`,
                  minHeight: 0, // Must also be here.
                  paddingRight: 5, // Must also be here.
                  outline: 0,
                  '&:hover': {}
                }

                const validFocusStyles: CSSObjectWithLabel = {
                  borderColor: 'var(--form-valid-border-color)',
                  boxShadow: `0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)`,
                  minHeight: 0, // Must also be here.
                  paddingRight: 5, // Must also be here.
                  outline: 0,
                  '&:hover': {}
                }

                let focusStyles = defaultFocusStyles
                if (error) {
                  focusStyles = invalidFocusStyles
                } else if (!error && touched) {
                  focusStyles = validFocusStyles
                }
                styles = { ...baseStyles, ...focusStyles }
              }

              //# We may need need to handle state.isDisabled as well.
              return styles
            },

            valueContainer: (baseStyles) => {
              return {
                ...baseStyles,
                padding: 0, // Overwrite: padding: "2px 8px"
                // target css-xxxxxx-Input
                '> div:nth-of-type(2)': {
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            },

            singleValue: (baseStyles) => {
              return {
                ...baseStyles
                // marginLeft: 0,  // Overwrite marginLeft: 2
                // marginRight: 0, // Overwrite marginRight: 2
              }
            },

            // This is fine, no modifications are needed.
            multiValue: (baseStyles) => {
              return {
                ...baseStyles
              }
            },

            indicatorSeparator: (baseStyles) => {
              return {
                ...baseStyles,
                margin: '5px',
                backgroundColor: error
                  ? 'var(--form-invalid-color)'
                  : !error && touched
                    ? 'var(--form-valid-color)'
                    : 'var(--form-border-color)',
                cursor: 'pointer'
              }
            },

            // Remove padding from child div that contains the <svg>.
            indicatorsContainer: (baseStyles) => {
              return {
                ...baseStyles,
                div: {
                  padding: 0,
                  color: error
                    ? 'var(--form-invalid-color)'
                    : !error && touched
                      ? 'var(--form-valid-color)'
                      : 'var(--form-border-color)',
                  cursor: 'pointer'
                }
              }
            },
            menu: (baseStyles) => {
              return {
                ...baseStyles,
                fontSize: 14, // ???
                overflow: 'hidden'
              }
            },

            menuList: (baseStyles) => {
              return {
                ...baseStyles,
                paddingTop: 0,
                paddingBottom: 0
              }
            }
          }}
          {...otherProps}
        />

        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

ReactSelect.displayName = 'ReactSelect'
