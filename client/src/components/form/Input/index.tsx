import { forwardRef, useId } from 'react'

type Ref = HTMLInputElement
///////////////////////////////////////////////////////////////////////////
//
// The following attributes are defined implicitly or explicitly
// through react-hook-form's register() configuation:
//
//   disabled
//   name
//   onChange
//   onBlur
//   min
//   max
//   minLength
//   maxLength
//   pattern
//   required
//   ref
//
// That said, if you're using Zod (or some other validation schema), I've
// found that it becomes the single source of truth for validation rules.
//
///////////////////////////////////////////////////////////////////////////

export type IInput = {
  error?: string // errors?.xxx?.message from react-hook-form

  formGroupClassName?: string
  formGroupStyle?: React.CSSProperties

  formText?: string
  formTextClassName?: string
  formTextStyle?: React.CSSProperties

  label?: string // Could be React.ReactNode, but string is okay for now.
  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: React.CSSProperties

  size?: 'sm' | 'lg'
  touched?: boolean // touchedFields?.xxx from react-hook-form
  /** string only */
  value?: string
  // size is an input attribute that defines width of an input by number of characters.
  // However, in this implementation, I'm using it to set a className property on the input.
} & Omit<React.ComponentProps<'input'>, 'size' | 'value'>

//# Create a separate <Label> component.

//# For all components, come up with a different prop name than size
//# because we may actually want to use size for <select multiple>, etc.

//# Go through the react-hook-form-2024 project and rename the various
//# page files, so that they are more descriptive.

//# Compare against Mantine, NextUI, React Bootstrap, Radix UI, etc.
//# Once all is said and done, then also do examples without RHF/Zod.

/* ========================================================================

======================================================================== */
// Next Steps:
// append,
// appendButton,
// onEnter,
// prepend,
// prependButton,

// Was doing = forwardRef(props: IInput, ref: ref: React.LegacyRef<HTMLInputElement> | undefined) => {}
export const Input = forwardRef<Ref, IInput>(
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
      size,
      style = {},
      touched,
      ...otherProps
    },
    ref
  ) => {
    // If id is not set, then fallback to using React's useId() hook.
    const uuid = useId()
    id = id || uuid

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
    ///////////////////////////////////////////////////////////////////////////
    //
    // Initialy, I was going to check for type='time' & if there was
    // no preexisting formText then output an AM/PM message
    // The goal would be to show that only when type='time.
    // In other words, don't show it if IE11 gracefully degrades to type='text'
    // The problem with that is that the graceful degradation happens in the
    // browser, not in the actual code. I suppose you could check the DOM,
    // but I don't want to bother with all of that...
    //
    ///////////////////////////////////////////////////////////////////////////

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
        <input
          autoComplete='off'
          className={getClassName()}
          disabled={disabled}
          id={id}
          ref={ref}
          spellCheck={false}
          style={style}
          type='text'
          {...otherProps}
        />
        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

Input.displayName = 'Input'

///////////////////////////////////////////////////////////////////////////
//
// By default, this component is uncontrolled. This follows the react-hook-form
// practice of making form fields uncontrolled, which then reduces renders.
// However, it is possible to make it controlled and even use it without Zod.
// For that, you'd want to implement something like this in the consuming component.
//
//   const [formSubmitted, setFormSubmitted] = useState(false)
//   const [firstName, setFirstName] = useState('')
//   const [firstNameTouched, setFirstNameTouched] = useState(false)
//   const [firstNameError, setFirstNameError] = useState('')
//
//   /* ======================
//       validateFirstName()
//   ====================== */
//
//   const validateFirstName = (value?: string) => {
//     console.log('validateFirstName() called.')
//     value = typeof value === 'string' ? value : firstName
//
//     if (typeof value === 'string' && value.trim() === '') {
//       const error = 'The name must be more than empty spaces.'
//       setFirstNameError(error)
//       return error
//     }
//
//     if (typeof value === 'string' && value.length <= 1) {
//       const error = 'The name must be greater than one character.'
//       setFirstNameError(error)
//       return error
//     }
//
//     setFirstNameError('')
//     return ''
//   }
//
//   /* ======================
//         validate()
//   ====================== */
//
//   const validate = () => {
//     const errors: string[] = []
//
//     // Set true on all toucher functions.
//     const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [setFirstNameTouched]
//     touchers.forEach((toucher) => { toucher(true) })
//
//     const validators: (() => string)[] = [validateFirstName]
//
//     validators.forEach((validator) => {
//       const error = validator()
//       if (error) {
//         errors.push(error)
//       }
//     })
//
//     // Return early if errors
//     if (errors.length >= 1) {
//       toast.error('Form validation errors found!')
//       return { isValid: false, errors: errors }
//     }
//
//     return { isValid: true, errors: null }
//  }
//
//   /* ======================
//         handleSubmit()
//   ====================== */
//
//   const handleSubmit /*:React.FormEventHandler<HTMLFormElement> */ = async (e: any) => {
//     e.preventDefault()
//     const { isValid } = validate()
//     if (!isValid) { return }
//
//     // Submission logic here...
//     setFormSubmitted(true)
//     ...
//   }
//
//   /* ======================
//           return
//   ====================== */
//
//   return (
//     <Fragment>
//
//       ...
//
//       <Input
//         formGroupClassName='mb-3'
//         formGroupStyle={{}}
//         id='firstName'
//         label='First Name'
//         labelRequired
//         error={firstNameError}
//         name='firstName'
//         onBlur={(e) => {
//           if (!firstNameTouched) {
//             setFirstNameTouched(true)
//           }
//           validateFirstName(e.target.value)
//         }}
//         onChange={(e) => {
//           setFirstName(e.target.value)
//           if (firstNameTouched) {
//             validateFirstName(e.target.value)
//           }
//         }}
//         touched={firstNameTouched}
//         value={firstName}
//       />
//
//       ...
//
//     </Fragment>
//   )
//
// Hopefully, the above code also demonstrates why it's better to use
// react-hook-form + Zod. Without those packages, the logic needed for
// managing a form is massive.
//
///////////////////////////////////////////////////////////////////////////
