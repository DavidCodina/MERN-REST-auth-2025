import { forwardRef, useId } from 'react'

type Ref = HTMLInputElement

export type IInputFile = {
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
  onClear?: () => void
  size?: 'sm' | 'lg'
  touched?: boolean
} & Omit<React.ComponentProps<'input'>, 'size' | 'type'>

/* ========================================================================

======================================================================== */

export const InputFile = forwardRef<Ref, IInputFile>(
  (
    {
      className = '',
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
      onClear,
      size,
      style = {},
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
      getButtonClassName()
    ====================== */

    const getButtonClassName = () => {
      let classes = 'btn-outline-neutral bg-white shadow-none'

      if (size === 'sm') {
        classes = `${classes} btn-sm`
      } else if (size === 'lg') {
        classes = `${classes} btn-lg`
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
            style={
              disabled
                ? { ...labelStyle, color: 'var(--form-disabled-color)' }
                : { ...labelStyle }
            }
          >
            {label}{' '}
            {labelRequired && (
              <sup
                className=''
                style={{
                  color: disabled ? 'inherit' : 'red' // ???
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
      <div className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}

        <div className='input-group'>
          <input
            autoComplete='off'
            className={getClassName()}
            disabled={disabled}
            id={id}
            ref={ref}
            spellCheck={false}
            style={style}
            type='file'
            {...otherProps}
          />

          {typeof onClear === 'function' && (
            <button
              className={getButtonClassName()}
              type='button'
              onClick={() => {
                onClear?.()
              }}
            >
              Clear
            </button>
          )}
        </div>

        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

InputFile.displayName = 'InputFile'
