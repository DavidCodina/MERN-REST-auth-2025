import { forwardRef, useId } from 'react'

type Ref = HTMLInputElement

export type IRadio = {
  error?: string // errors?.xxx?.message (from react-hook-form).
  formText?: string
  formTextClassName?: string
  formTextStyle?: React.CSSProperties
  label?: string // Could be React.ReactNode, but string is okay for now.
  labelClassName?: string
  labelStyle?: React.CSSProperties
  showError?: boolean
  touched?: boolean // touchedFields?.xxx as unknown as boolean (from react-hook-form).
} & Omit<React.ComponentProps<'input'>, 'type'>

/* ========================================================================

======================================================================== */
// The difference between Check/Radio and Input is that Check/Radio does not
// have formGroupClassName, formGroupStyle, labelRequired, or size props.
// Check/Radio also adds the showError prop.

export const Radio = forwardRef<Ref, IRadio>(
  (
    {
      className = '',
      disabled = false,
      error,
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      id,
      label = '',
      labelClassName = '',
      labelStyle = {},
      style = {},
      showError = false,
      touched,
      ...otherProps
    },
    ref
  ) => {
    const uuid = useId()
    id = id || uuid

    /* ======================
          getClassName()
    ====================== */

    const getClassName = () => {
      let classes = 'form-check-input'

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
            className={`form-check-label${
              labelClassName ? ` ${labelClassName}` : ''
            }`}
            style={{
              ...labelStyle,
              ...(disabled ? { color: 'var(--form-disabled-color)' } : {})
            }}
          >
            {label}
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
            style={{ marginLeft: '-1.5em', ...formTextStyle }}
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
    // The error should only show up for the last check in a group.
    // In order to make this work, I'm using a showError prop.
    // This is not ideal, but I'd rather not use querySelectorAll()
    // to query the DOM directly, as that could be error prone.

    const renderError = () => {
      if (error && showError) {
        return (
          <div className='invalid-feedback' style={{ marginLeft: '-1.5em' }}>
            {error}
          </div>
        )
      }
      return null
    }

    /* ======================
            return
    ====================== */

    return (
      <div className='form-check'>
        <input
          className={getClassName()}
          disabled={disabled}
          id={id}
          ref={ref}
          style={style}
          type='radio'
          {...otherProps}
        />

        {renderLabel()}
        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

Radio.displayName = 'Radio'
