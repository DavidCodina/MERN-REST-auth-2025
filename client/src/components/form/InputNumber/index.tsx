// Originally built on top of "react-number-format": "^5.3.4",
import {
  forwardRef,
  useId,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import {
  NumericFormat
  // useNumericFormat
  // OnValueChange
  // SourceInfo
} from 'react-number-format'
import { Controls } from './Controls'
import {
  getIsOutOfRange,
  getCountOfLeadingZeros,
  stripNonNumeric,
  numberOrUndefined,
  formatLeadingZeros,
  clamp,
  createValuesAndSourceInfo,
  prependZero
} from './utils'
import { Props, Ref } from './types'

export type { NumberFormatValues } from 'react-number-format'

/* ========================================================================
                                InputNumber 
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component was inspired by Mantine's NumberInput.
// However, Mantine breaks its implementations into so many different abstraction
// layers that it's very difficult to understand or reproduce. Instead, I just
// took the idea of using NumericFormat and some of the props and then just figured
// the rest out. Without comments this file is around 700 lines. There's a lot
// happening here. It's complex, but not overengineered...
//
///////////////////////////////////////////////////////////////////////////

//! Edge cases:
//! What if prefix is '-'?
//! What if decimalSeparator is '-'?

export const InputNumber = forwardRef<Ref, Props>(
  (
    {
      allowDecimal = true, // Has precedence over decimalScale
      allowedDecimalSeparators,
      allowLeadingZeros = false,
      // callOnValueChangeOnMount is a nice-to-have. However, it's unconventional.
      // Suppose you had a form with preopulated values. You might not want to
      // automatically change the initial value.
      callOnValueChangeOnMount = false,
      ///////////////////////////////////////////////////////////////////////////
      //
      // 'strict' leads to some unexpected results whereby a user might not understand
      // why they can't add/delete a character, or why cutting/pasting just doesn't work.
      // 'blur' results in a more intuitive flow where the user can see their value initially,
      // but it then might get changed to conform to the min/max. The downside here is that
      // they might not expect the value to be automatically changed.
      //
      // If there's a min or max, then we probably don't want clampBehavior = 'none'.
      // However, we MIGHT want 'none'... Why? Maybe we don't want to clamp, but we do
      // want the min/max to enforce the lower/upper limit on the spinners.
      //
      ///////////////////////////////////////////////////////////////////////////
      clampBehavior = 'blur',
      className = '',
      decimalScale,
      decimalSeparator = '.',
      defaultValue = '',
      disabled = false,
      error,
      fixedDecimalScale = false,
      formGroupClassName = '',
      formGroupStyle = {},
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      hideControls = false,
      id,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},
      max,
      min,
      onBlur,
      onChange,
      onKeyDown,
      onPaste,
      onValueChange,
      prefix,
      prependZero: shouldPrependZero = true,
      size,
      step = 1,
      stepHoldDelay = 500,
      stepHoldInterval = 100,
      style = {},
      suffix,
      thousandSeparator,
      touched,
      value, // Do not default to ''
      withKeyboardEvents = true,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
            constants
    ====================== */

    const uuid = useId()
    id = id || uuid

    // Initially, I typed min/max as an optional number. However, react-hook-form's
    // UseFormRegisterReturn types it as string | number, so I had to change it.
    const minNumberOrUndefined = numberOrUndefined(min)
    const maxNumberOrUndefined = numberOrUndefined(max)

    // NumericFormat does not have an allowDecimpal prop.
    // Mantine's NumberInput does have an allowDecimal prop.
    // As near as I can tell, allowDecimal is merely for convenience
    // and simply sets decimalScale to 0 when false.
    decimalScale = allowDecimal === false ? 0 : decimalScale

    ///////////////////////////////////////////////////////////////////////////
    //
    // allowNegative should always be true if min/max are negative.
    // allowNegative should be true by default.
    //
    // While NumericFormat exposes an allowNegative prop, it's more common to
    // have a min/max on number inputs. The min/max feature works in conjunction with the
    // the clampBehavior prop (and spinner controls). However, both stripping negative then clamping,
    // and clamping then stripping negative can lead to unexpected results. In other words,
    // neither sequence of operations is necessarily more intuitive. For this reason,
    // it's bettter to infer allowNegative from the min/max props. This is one place
    // where I differ from the Mantine UI approach. Thus, if either min/max is negative,
    // then allowNegative.
    //
    ///////////////////////////////////////////////////////////////////////////

    const minisNegative =
      typeof minNumberOrUndefined == 'number' && minNumberOrUndefined < 0
    const maxisNegative =
      typeof maxNumberOrUndefined == 'number' && maxNumberOrUndefined < 0

    // The 'undefined' check is to allowNegative by default.
    const allowNegative =
      minisNegative || maxisNegative || typeof min === 'undefined'

    // NumericFormat's thousandSeparator when true will be ','.
    // However, we actually need to check thouseandSeparator for ',' in some cases,
    // so it's best to do the conersion beforehand.
    thousandSeparator = thousandSeparator === true ? ',' : thousandSeparator

    step = typeof step === 'number' ? step : 1

    /* ======================
          state & refs
    ====================== */

    const internalRef = useRef<HTMLInputElement | null>(null)
    const firstRenderRef = useRef(true)
    const floatValueRef = useRef<number>(0)
    const isProgrammaticUpdateRef = useRef(false)

    const cursorRef = useRef<number | null>(null)

    const hasPastedRef = useRef(false)

    const [internalValue, setInternalValue] = useState(() => {
      let initialValue = value || defaultValue || ''

      initialValue =
        typeof initialValue === 'string'
          ? initialValue
          : initialValue.toString()

      // At this point, it's possible that initialValue is some weird string like 'abc123'.
      // This won't hurt NumericFormat if it's passed in as the value.
      // However, just to keep things more in sync, we can do this:

      // We don't actually need to consider the thousandSeparator here.
      // Instead, we can just strip it out and rely on NumericFormat to add it back
      // as needed. Conversely, the decimalSeparator MUST be considered because
      // inadvertently stripping it out can fundamentally change the meaning of the value.
      const replacePattern = new RegExp(`[^0-9\\${decimalSeparator}-]`, 'g')
      initialValue = initialValue.replace(replacePattern, '')

      // NumericFormat will NOT strip leading zeros for the initialValue passed in.
      // Rather, it works by preventing such values only when the value changes.
      // If we also want to restrict leading zeros in the initialValue, we
      // need to manually do that ourselves.
      if (allowLeadingZeros !== true) {
        initialValue = formatLeadingZeros({
          decimalSeparator,
          value: initialValue
        })
      }

      if (
        (clampBehavior === 'blur' || clampBehavior === 'strict') &&
        (typeof minNumberOrUndefined === 'number' ||
          typeof maxNumberOrUndefined === 'number')
      ) {
        // clamp() will strip leading zeros even when leading zeros are allowed.
        // To prevent this, get the leadinZerosCount and add them back after clamping.
        const leadingZerosCount = getCountOfLeadingZeros({
          value: initialValue,
          decimalSeparator,
          prefix
        })

        initialValue = clamp({
          decimalSeparator: decimalSeparator,
          max: maxNumberOrUndefined,
          min: minNumberOrUndefined,
          value: initialValue
        })

        // At this point, initialValue will be a string representation of a clamped number.
        // It will also have all of its formatting removed, which is okay because it's going
        // to get passed right back into NumericFormat (or numericFormatter).

        if (leadingZerosCount > 0 && initialValue.startsWith('-')) {
          initialValue = `-${'0'.repeat(leadingZerosCount)}${initialValue.slice(1)}`
        } else if (leadingZerosCount > 0) {
          initialValue = `${'0'.repeat(leadingZerosCount)}${initialValue}`
        }
      }

      return initialValue
    })

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
        useLayoutEffect()
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // The primary job of this useLayoutEffect() is to watch for changes to internalValue.
    // In cases where isProgrammaticUpdateRef.current is true, it will
    // manually construct values and sourceInfo and call the parent's onValueChange().
    //
    // Why do we need to do this?  Because unfortunately, NumericFormat doesn't consistently
    // call its own onValueChange() every time its value changes. After setting internalValue,
    // NumericFormat will trigger its own onValueChange() only in certain cases:
    //
    //   - if there's a prefix/suffix
    //   - if there's a decimalSeparator that gets implemented.
    //   - if there's a thousandSeparator that gets implemented.
    //
    // Essentially, it seems to get called any time values.formattedValue !== values.value.
    // However, in other cases it WILL NOT trigger onValueChange()
    // Consequently, a useLayoutEffect() that merely callssetInternalValue(...)
    // then expects NumericFormat's onValueChange() to run will not work.
    //
    // Instead, we need to manually build out values and sourceInfo and call the
    // EXTERNAL onValueChange?.(values, sourceInfo) manually. This is the way...
    //
    // Mantine's NumberInput also manually constructs the values (i.e., payload).
    // However, the logic they use produces inconsistent results:
    //
    //   Typing '3':          { floatValue : 3, formattedValue: "3.00", value:  "3.00" }
    //   Incrementing to '3': { floatValue : 3, formattedValue: "3",    value:  "3"    }
    //
    /////////////////////////
    //
    // The useLayoutEffect() also checks callOnValueChangeOnMount on first render.
    // If callOnValueChangeOnMount is true, the it also calls the parent's onValueChange()
    //
    /////////////////////////
    //
    // The useLayoutEffect() also uses internalValue to conditionally set floatValueRef.current
    // to 0 when internalValue is ''..
    //
    ///////////////////////////////////////////////////////////////////////////

    useLayoutEffect(() => {
      if (internalValue === '') {
        floatValueRef.current = 0
      }

      // If there's no internalRef.current then there's no point in proceeding.
      if (!internalRef.current) {
        return
      }

      if (firstRenderRef.current === true) {
        if (callOnValueChangeOnMount === true) {
          isProgrammaticUpdateRef.current = true
        }
      }

      // Only proceed if isProgrammaticUpdateRef.current is true.
      // This will be set to true above when callOnValueChangeOnMount is true,
      // or within the spinner control handlers.
      if (isProgrammaticUpdateRef.current === false) {
        if (firstRenderRef.current === true) {
          firstRenderRef.current = false
        }
        return
      }

      // Reset isProgrammaticUpdateRef.current back to false for the next iteration.
      isProgrammaticUpdateRef.current = false

      const { values, sourceInfo } = createValuesAndSourceInfo(internalValue, {
        allowNegative: allowNegative,
        decimalScale: decimalScale,
        decimalSeparator: decimalSeparator,
        fixedDecimalScale: fixedDecimalScale,
        prefix: prefix,
        suffix: suffix,
        thousandSeparator: thousandSeparator
      })

      if (firstRenderRef.current === true) {
        firstRenderRef.current = false

        if (callOnValueChangeOnMount === true) {
          onValueChange?.(values, sourceInfo)
        }
        return
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // We don't want manually call the external onValueChange in those cases where the
      // internal NumericFormat onValueChange will already do it for us.
      // The internal onValueChange() fires whenever its values.value !== to values.formattedValue,
      //
      // We want to opt-out whenever we know for sure that NumericFormat's onValueChange() will fire.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (values.formattedValue !== values.value) {
        return
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // However, there are also circumstances when the comparison WILL be equal,
      // such as when we type '1' when there is no special formatting.
      // Consequently, we ALSO need to  use an isProgrammaticUpdateRef.
      // Using both checks will best optimize the render cycle and number
      // of hits the external onValueChange() gets.
      //
      ///////////////////////////////////////////////////////////////////////////

      // console.log('Programmatic update...', { values })
      onValueChange?.(values, sourceInfo)

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      internalValue
      // ❌ onValueChange,
    ])

    /* ======================
        useLayoutEffect()
    ====================== */
    // This useLayoutEffect() watches for changes to internalValue.
    // It then looks for a number in cursorRef.current. If found, it sets the cursor position,
    // then resets the cursorRef.current to null.

    useLayoutEffect(() => {
      // setTimeout pushes the cursor positioning code to the end of the JavaScript event loop.
      // This allows any pending DOM updates to complete before the cursor is repositioned.
      // However, even with the setTimeout, there may still be a brief cursor position flicker
      // as the position changes. To mitigate this, we can set the caretColor to transparent until
      // the cursor is moved.
      setTimeout(() => {
        if (internalRef.current && typeof cursorRef.current === 'number') {
          internalRef.current.setSelectionRange(
            cursorRef.current,
            cursorRef.current
          )

          if (internalRef.current) {
            internalRef.current.style.caretColor = ''
          }

          cursorRef.current = null
        }
      }, 0)
    }, [internalValue])

    /* ======================
        useLayoutEffect()
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // This useLayouteEffect() watches for changes to the value prop and helps
    // maintain the two-way binding for controlled implementations.
    // When a value change occurs, it sets internalValue accordingly.
    // Then the new internalValue is passed into NumericFormat.
    //
    // The logic here goes one step further and guards against values that exceed the
    // range of min/max. If a value outside of the range occurs, the implemntation will not
    // only prevent the update to internalValue, but will also call the parent's onValueChange()
    // function and pass back the closest in-range value, effectively correcting any controlled
    // state in the parent. This is helpful for preventing the parent's state from exceeding the
    // range, and also getting out of sync.
    //
    ///////////////////////////////////////////////////////////////////////////

    useLayoutEffect(() => {
      // If the value is undefined, then assume that an uncontrolled implementation is
      // being used. Deliberately setting a form's value to undefined is an anti-pattern.
      if (typeof value === 'undefined') {
        return
      }

      // If the user types in a new value, then NumericFormat will call setInternalValue()
      // with that value. Then the parent component will likely update its own state and
      // pass the value right back in. This means that there will often be cases where
      // value === internalValue. In that instance,  return early.
      // This also opts out of the first render cycle.
      if (value === internalValue) {
        return
      }

      // If the consumer passes in null, that's still an anti-pattern, but treat it as ''.
      if (value === '' || value === null) {
        floatValueRef.current = 0
        setInternalValue('')
        return
      }

      // Create maybeFloat from value, which can be string | number.
      const maybeFloat = (() => {
        if (typeof value === 'number' && !isNaN(value)) {
          return value
        }

        // Derive the numeric value from the string value.
        if (typeof value === 'string') {
          let cleanedValue = stripNonNumeric({
            value: value,
            decimalSeparator: decimalSeparator
          })

          if (decimalSeparator !== '.') {
            cleanedValue = cleanedValue.replace(decimalSeparator, '.')
          }

          return numberOrUndefined(cleanedValue)
        }
      })()

      // If mabyeFloat is not a number, then return early.
      // We've already handled undefined, '', and null cases above,
      // so if it's not a number at this point, then the consumer
      // likey passed in the wrong type.
      if (typeof maybeFloat !== 'number' || isNaN(maybeFloat)) {
        // console.warn(`InputNumber's useLayoutEffect() that watches the value prop returned early because it could not parse the value.`)
        return
      }

      // Check if value is over max.
      if (
        typeof maxNumberOrUndefined === 'number' &&
        maybeFloat > maxNumberOrUndefined
      ) {
        floatValueRef.current = maxNumberOrUndefined

        const { values, sourceInfo } = createValuesAndSourceInfo(
          maxNumberOrUndefined.toString(),
          {
            allowNegative: allowNegative,
            decimalScale: decimalScale,
            decimalSeparator: decimalSeparator,
            fixedDecimalScale: fixedDecimalScale,
            prefix: prefix,
            suffix: suffix,
            thousandSeparator: thousandSeparator
          }
        )

        setInternalValue(values.value)
        onValueChange?.(values, sourceInfo)
        return
      }

      // Check if value is under min.
      if (
        typeof minNumberOrUndefined === 'number' &&
        maybeFloat < minNumberOrUndefined
      ) {
        floatValueRef.current = minNumberOrUndefined

        const { values, sourceInfo } = createValuesAndSourceInfo(
          minNumberOrUndefined.toString(),
          {
            allowNegative: allowNegative,
            decimalScale: decimalScale,
            decimalSeparator: decimalSeparator,
            fixedDecimalScale: fixedDecimalScale,
            prefix: prefix,
            suffix: suffix,
            thousandSeparator: thousandSeparator
          }
        )

        setInternalValue(values.value)
        onValueChange?.(values, sourceInfo)
        return
      }

      // Any time a new value is received, we DO NOT set isProgrammaticUpdateRef.current = true
      floatValueRef.current = maybeFloat
      setInternalValue(maybeFloat.toString())

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      // ❌ internalValue, // Avoid infinite loop.
      value
    ])

    /* ======================
          useEffect()
    ====================== */
    // Set the initial floatValueRef.current. It's safer to do it here in a useEffect() where
    // we can get the starting value straight off of the input after the first render.

    useEffect(() => {
      if (!internalRef.current) {
        return
      }

      let cleanedValue = stripNonNumeric({
        value: internalRef.current.value, // i.e., formattedValue
        decimalSeparator: decimalSeparator
      })

      if (decimalSeparator !== '.') {
        cleanedValue = cleanedValue.replace(decimalSeparator, '.')
      }

      const floatOrUndefined = numberOrUndefined(cleanedValue)

      if (typeof floatOrUndefined === 'number') {
        floatValueRef.current = floatOrUndefined
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
      <div className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}

        <div className='relative'>
          <NumericFormat
            {...otherProps}
            // By default allowLeadingZeros is false.
            // The user can enter them in, but they will be removed onBlur
            allowLeadingZeros={allowLeadingZeros} // Default: false
            allowNegative={allowNegative} // Default: true
            // Characters which when pressed result in a decimal separator.
            // When missing, decimal separator and '.' are used.
            // Thus pressing '%' results in a '.' being inserted.
            allowedDecimalSeparators={allowedDecimalSeparators}
            autoComplete='off'
            className={getClassName()}
            decimalScale={decimalScale}
            decimalSeparator={decimalSeparator}
            disabled={disabled}
            // While NumericFormat can take a defaultValue, we will never actually use it.
            // Why? Because we need the internal implementation to be controlled.
            // defaultValue={ ... }
            displayType='input'
            fixedDecimalScale={fixedDecimalScale}
            getInputRef={(node: HTMLInputElement) => {
              // We can't know in advance whether ref will be a function or an object literal.
              // For that reason, we need to use the following conditional logic.
              // https://stackoverflow.com/questions/71495923/how-to-use-the-ref-with-the-react-hook-form-react-library
              if (ref && 'current' in ref) {
                ref.current = node
              } else if (typeof ref === 'function') {
                ref?.(node)
              }
              internalRef.current = node
            }}
            id={id}
            //# https://s-yadav.github.io/react-number-format/docs/props#isallowed-values--boolean
            //# This isAllowed prohibits double leading zeros.
            //# However, what we really want to do is have a more sophisticated regex.

            // Gotcha: This will only trigger when a change occurs. Consequently, if we want the
            // initialValue to also get clamped, then we need to do that in the state initializer.
            isAllowed={(values) => {
              const { floatValue, value /*, formattedValue*/ } = values

              // If clampBehavior === 'strict' then implement logic
              // that prohbits values that are out of range.
              if (
                clampBehavior === 'strict' &&
                typeof floatValue !== 'undefined'
              ) {
                const isOutOfRange = getIsOutOfRange({
                  max: maxNumberOrUndefined,
                  min: minNumberOrUndefined,
                  value: floatValue
                })

                if (isOutOfRange) {
                  return false
                }
              }

              // Opt out certain prohibitions when pasting. Arguably, this is a
              // arbitrary, but it leads to a more intuitive user experience.
              if (hasPastedRef.current === false) {
                // The gotcha here is that it won't allow you to delete '1001' from the leading '1',
                // so maybe it works a little too well. To mitigate this, we can make it so
                // we only return false when the user is adding characters (i.e., !isDeleting).
                const isDeleting = internalValue.length > value.length
                if (allowLeadingZeros === false && !isDeleting) {
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // Note: Initially, I was testing agaist a regex that had a dynamic
                  // decimialSeparator.
                  //
                  //   const regex = new RegExp(`^-?0[0-9]+(${decimalSeparator}.*)?$`)
                  //
                  // However, values.value's decimals separator is
                  // ALWAYS the '.' character, so that is not necessary and would
                  // actually break the expected behavior.
                  //
                  ///////////////////////////////////////////////////////////////////////////

                  const regex = /^-?0[0-9]+(\..*)?$/
                  const hasLeadingZeros = regex.test(value)
                  return !hasLeadingZeros
                }
              }

              return true
            }}
            onBlur={(e) => {
              onBlur?.(e)

              if (
                clampBehavior === 'blur' &&
                (typeof minNumberOrUndefined === 'number' ||
                  typeof maxNumberOrUndefined === 'number')
              ) {
                // clamp() will strip leading zeros even when leading zeros are allowed.
                // To prevent this, get the leadinZerosCount and add them back after clamping.
                const leadingZerosCount = getCountOfLeadingZeros({
                  decimalSeparator,
                  prefix,
                  value: e.target.value
                })

                let newValue = shouldPrependZero
                  ? prependZero({
                      decimalSeparator,
                      prefix,
                      value: e.target.value
                    })
                  : e.target.value

                newValue = clamp({
                  decimalSeparator: decimalSeparator,
                  max: maxNumberOrUndefined,
                  min: minNumberOrUndefined,
                  value: newValue //e.target.value // i.e., formattedValue //! But not exactly.
                })

                // At this point, newValue will be a string representation of a clamped number.
                // It will also have all of its formatting removed, which is okay because it's going
                // to get passed right back into NumericFormat (or numericFormatter).

                //# Retest this...
                if (leadingZerosCount > 0 && newValue.startsWith('-')) {
                  newValue = `-${'0'.repeat(leadingZerosCount)}${newValue.slice(1)}`
                } else if (leadingZerosCount > 0) {
                  newValue = `${'0'.repeat(leadingZerosCount)}${newValue}`
                }

                ///////////////////////////////////////////////////////////////////////////
                //
                // Without also setting isProgrammaticUpdateRef.current to true, the value will
                // update in the UI, but not actually get passed back to the parent's onValueChange.
                // The gotcha here is that if clampedValue === internalValue, then the
                // useLayoutEffect() that watches for programmatic updates will not run,
                // leaving isProgrammaticUpdateRef.current as true, which is incorrect.
                // Thus, we can do a comparison check that returns early. Just make sure that
                // onBlur?.(e) is called at the top of the function body.
                //
                ///////////////////////////////////////////////////////////////////////////

                if (newValue === internalValue) {
                  return
                }

                isProgrammaticUpdateRef.current = true
                setInternalValue(newValue)
              } else {
                if (shouldPrependZero) {
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // Mantine prepends '0' to any value that begins with the decimalSeparator.
                  // This is simple enough to accomplish on blur.
                  // However, doing it on change is trickier. Why? Beca use
                  // if the user is backspacing, then we don't want to enforce this rule.
                  // For now, I've decided not to implement insertZero() on change.
                  // If you decide to do this in the future, you'll need an onKeyDownHanlder
                  // that does:
                  //
                  //   if (e.key === 'Backspace' || (e.metaKey && e.key === 'x')) {
                  //     deleteRef.current = true
                  //   }
                  //
                  // Then uses that ref to from within the NumericFormat's onValueChange() to
                  // potentiallly call prependZero().
                  //
                  ///////////////////////////////////////////////////////////////////////////
                  const newValue = prependZero({
                    decimalSeparator,
                    prefix,
                    value: e.target.value // i.e., formattedValue
                  })

                  if (newValue !== e.target.value) {
                    isProgrammaticUpdateRef.current = true
                    setInternalValue(newValue)
                  }
                }
              }
            }}
            ///////////////////////////////////////////////////////////////////////////
            //
            // NumericFormat behaves normally and uses the standard onChange handler:
            //
            //   ChangeEventHandler<HTMLInputElement> | undefined
            //
            // Mantine's NumberInput uses a non-standard onChange that instead returns the floatValue or string:
            //
            //   ((value: number | string) => void) | undefined
            //
            // In Mantine the value coming back from onChange is a number except when it's an empty string.
            // Because we already expose an onValueChange prop that passes back the floatvalue, there's really
            // no reason to modify the onChange handler. In fact, it's more useful to allow it to pass back the
            // event (as normal). Note: the e.target.value will represent the formattedValue, and not the values.value.
            // This, again, is probably for the best.
            //
            ///////////////////////////////////////////////////////////////////////////
            onChange={(e) => {
              onChange?.(e)
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e)

              if (
                disabled ||
                otherProps.readOnly ||
                !withKeyboardEvents ||
                typeof floatValueRef.current !== 'number'
              ) {
                return
              }

              const floatValue = floatValueRef.current

              if (e.key === 'ArrowUp') {
                e.preventDefault()

                const outOfRange =
                  typeof maxNumberOrUndefined === 'number' &&
                  floatValue + step > maxNumberOrUndefined
                if (outOfRange) {
                  return
                }

                const newFloatValue = floatValue + step
                floatValueRef.current = newFloatValue

                // Logic for cursor consistently being in end position.
                const newStringValue = newFloatValue.toString()
                if (typeof newStringValue === 'string') {
                  cursorRef.current = newStringValue.length
                  if (internalRef.current) {
                    internalRef.current.style.caretColor = 'transparent'
                  }
                }

                isProgrammaticUpdateRef.current = true
                setInternalValue(newFloatValue.toString())
              }

              if (e.key === 'ArrowDown') {
                e.preventDefault()

                const outOfRange =
                  typeof minNumberOrUndefined === 'number' &&
                  floatValue - step < minNumberOrUndefined
                if (outOfRange) {
                  return
                }

                const newFloatValue = floatValue - step
                floatValueRef.current = newFloatValue

                // Logic for cursor consistently being in end position.
                const newStringValue = newFloatValue.toString()
                if (typeof newStringValue === 'string') {
                  cursorRef.current = newStringValue.length
                  if (internalRef.current) {
                    internalRef.current.style.caretColor = 'transparent'
                  }
                }

                isProgrammaticUpdateRef.current = true
                setInternalValue(newFloatValue.toString())
              }
            }}
            onPaste={(e: any) => {
              onPaste?.(e)

              // Create a small 'window' of time so isAllowed prop
              // can conditionally paste certain values.
              hasPastedRef.current = true
              setTimeout(() => {
                hasPastedRef.current = false
              }, 150)
            }}
            ///////////////////////////////////////////////////////////////////////////
            //
            // https://s-yadav.github.io/react-number-format/docs/props#onvaluechange-values-sourceinfo--
            // https://s-yadav.github.io/react-number-format/docs/quirks/#values-object
            //
            // onChangeValue is much more useful than the standard onChange.
            //
            //   values:     {formattedValue: '$12.00', value: '12.00', floatValue: 12}
            //   sourceInfo: {event: SyntheticBaseEvent, source: 'event'}
            //
            // Also onValueChange runs onBlur in some cases.
            //
            ///////////////////////////////////////////////////////////////////////////
            onValueChange={(values, sourceInfo) => {
              floatValueRef.current =
                typeof values.floatValue === 'undefined' ? 0 : values.floatValue

              /* ======================
                  shouldPrependZero
              ====================== */

              if (shouldPrependZero) {
                // The internalValue is essentially the previous value.
                // It can potentially be formatted, so we should clean it first.
                const cleanedInternalValue = stripNonNumeric({
                  value: internalValue,
                  decimalSeparator: decimalSeparator
                })

                const shouldSkipPrependZero =
                  (values.value.startsWith(decimalSeparator) ||
                    values.value.startsWith(`-${decimalSeparator}`)) &&
                  (cleanedInternalValue.startsWith(`0${decimalSeparator}`) ||
                    cleanedInternalValue.startsWith(`-0${decimalSeparator}`))

                const targetValue = sourceInfo.event?.target
                  ? (sourceInfo.event.target as HTMLInputElement).value
                  : values.formattedValue

                const newValue = prependZero({
                  decimalSeparator,
                  prefix,
                  value: targetValue // This needs to be the formattedValue
                })

                if (
                  newValue !== values.formattedValue &&
                  !shouldSkipPrependZero
                ) {
                  isProgrammaticUpdateRef.current = true
                  setInternalValue(newValue)
                  return
                }
              }

              /* ======================

              ====================== */

              // console.log('Automatic update...')
              setInternalValue(values.value)
              onValueChange?.(values, sourceInfo)
            }}
            prefix={prefix}
            spellCheck={false}
            style={{
              backgroundPosition: !hideControls
                ? 'right calc(0.375em + 1.5rem) center'
                : '',
              ...style
            }}
            suffix={suffix}
            // Note: there's also a thousandsGroupStyle
            thousandSeparator={thousandSeparator}
            type='text'
            // Because internalValue will always be a string, we can set valueIsNumericString to true,
            // instead of the default false. That said, I never ran into a case where this seemed necessary.
            // It seems like it might be used more often in conjunction with the <PatternFormat /> component
            // when the format prop is also implemented.
            // valueIsNumericString={true}
            value={internalValue}
            // https://s-yadav.github.io/react-number-format/docs/props#isallowed-values--boolean
          />

          <Controls
            cursorRef={cursorRef}
            disabled={disabled}
            error={error}
            floatValueRef={floatValueRef}
            hideControls={hideControls}
            internalRef={internalRef}
            isProgrammaticUpdateRef={isProgrammaticUpdateRef}
            maxNumberOrUndefined={maxNumberOrUndefined}
            minNumberOrUndefined={minNumberOrUndefined}
            setInternalValue={setInternalValue}
            step={step}
            stepHoldDelay={stepHoldDelay}
            stepHoldInterval={stepHoldInterval}
            touched={touched}
          />
        </div>

        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

InputNumber.displayName = 'InputNumber'
