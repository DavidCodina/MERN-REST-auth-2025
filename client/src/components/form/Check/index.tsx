import { forwardRef, useId } from 'react'

type Ref = HTMLInputElement

export type ICheck = {
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

export const Check = forwardRef<Ref, ICheck>(
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
          type='checkbox'
          {...otherProps}
        />

        {renderLabel()}
        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

Check.displayName = 'Check'

/* 
Usage:

<div className='mb-3'>
  <label className='form-label'>
    Select A Cat <sup style={{ color: 'red' }}>*</sup>
  </label>
  <Check
    error={errors?.cats?.message}
    id='cat-1'
    label='Muffy'
    // onClick={(e) => console.log((e.target as HTMLInputElement).checked)}
    touched={touchedFields?.cats as unknown as boolean}
    value='Muffy'
    {...register('cats')}
  />

  <Check
    error={errors?.cats?.message}
    id='cat-2'
    label='Gingerbread'
    touched={touchedFields?.cats as unknown as boolean}
    value='Gingerbread'
    {...register('cats')}
  />

  <Check
    error={errors?.cats?.message}
    id='cat-3'
    label='Punkin'
    showError
    touched={touchedFields?.cats as unknown as boolean}
    value='Punkin'
    {...register('cats')}
  />
</div>


Gotcha: {...register('cats')}
    
react-hook-form types the value touchedFields?.cats as boolean[].
This happens because FormValues (correctly) types cats as string[],
but then when useForm<FormValues>, react-hook-form somehow incorrectly
infers that touchedFields?.cats will be boolean[].
But if you actually look at what it's doing, it's just a single boolean.
To get around this we can do:

  touched={typeof touchedFields?.cats === 'boolean' ? touchedFields?.cats : undefined }


Or typecast it as follows:

  touched={touchedFields?.cats as unknown as boolean}


Why is this happening? Often when one uses array in react-hook-form,
we break up registered values by doing:

  {...register('cats.0')}
  {...register('cats.1')}
  {...register('cats.2')}


That has the effect of splitting touchedFields.cats and errors.cats into
an array of parallel values. And if we were to do that, then the Typescript
thinking touchedFields?.cats was boolean[] would be true. However, that is NOT
what we want to do.

This seems to be a case where react-hook-form's typings are a little buggy,
and we just need to deal with it.
*/
