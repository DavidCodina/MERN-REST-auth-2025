import {
  forwardRef,
  useId,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useReducer
} from 'react'
import { formatValue, getIsOutOfRange, strIsZeroLike } from './utils'
import { IInputNumber } from './types'

/* 

Can this be used:

function isValidNumber(value: number | string | undefined): value is number {
  return (
    (typeof value === 'number' ? value < Number.MAX_SAFE_INTEGER : !Number.isNaN(Number(value))) &&
    !Number.isNaN(value)
  );
}

function isInRange(value: number | undefined, min: number | undefined, max: number | undefined) {
  if (value === undefined) {
    return true;
  }

  const minValid = min === undefined || value >= min;
  const maxValid = max === undefined || value <= max;

  return minValid && maxValid;
}

export type NumberInputStylesNames = 'controls' | 'control' | __InputStylesNames;
export type NumberInputCssVariables = {
  controls: '--ni-chevron-size';
};

*/
/* ========================================================================
                              InputNumber
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component began by using <Input /> then I added each additional feature.
// It uses type="text"
// It's inspired by Mantine's NumberInput:
//
//   https://mantine.dev/core/number-input/
//   https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/NumberInput/NumberInput.tsx
//
// In the most basic sense, the goal is to receive a value, then format it.
// To this end, most of the heavy lifting is done in the formatValue() utility function.
// Here's what it does:
//
//   1. stripNonNumeric
//   2. formatDecimalSeparator
//   3. formatMinuses
//   4. formatLeadingZeros
//   5. add0IfStartsWithDecimalSeparator
//   6. formatDecimalScale
//   7. formatFixedDecimalScale
//   8. addThousandSeparator
//
// The next biggest logic chunk is the useEffect() --> calculateCursorPosition()
//
// Beyond that, onBlur() implements some additional formatting, including clamp().
// See also onKeyDown(), onCut(), and onPaste().
//
//# Next steps:
//#
//#   Add in spinners.
//#   prefix/suffix (Make a backup copy first. I have a feeling this will throw a monkey wrench into the works.)
//#   Keyboard accessibility (eventually)
//#   Eventually add support for "Delete".
//
//# Note: Another possible implementation that is probably easier would be to build a wrapper around 'react-number-format'
//# In fact, that's what Mantine does: https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/NumberInput/NumberInput.tsx
//
///////////////////////////////////////////////////////////////////////////

export const InputNumber = forwardRef<any, IInputNumber>(
  (
    {
      allowNegative = true,
      allowDecimal = true,
      clampBehavior = 'blur',
      defaultValue = '',
      decimalScale,
      fixedDecimalScale = false, // fixedDecimalScale depends on decimalScale
      thousandSeparator,
      min,
      max,
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
      onKeyDown,
      onBlur,
      onChange,
      onCut,
      onPaste,

      value,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
            constants
    ====================== */

    // If id is not set, then fallback to using React's useId() hook.
    const uuid = useId()
    id = id || uuid

    // Mantine has this thing called a decimalSeparator that allows the consumer to pass in
    // their own custom decimal separator instead of '.'. For now I've hardcoded it internally.
    // The problem with allowing a custom decimalSeparator is that it could interfere with
    // parsing operations (e.g. pareFloat(), etc.).
    const decimalSeparator = '.'

    // Initially, I typed min/max as an optional number. However, react-hook-form's
    // UseFormRegisterReturn types it as string | number, so I had to change it.
    const minNumberOrUndefined = typeof min === 'string' ? parseFloat(min) : min // number | undefined
    const maxNumberOrUndefined = typeof max === 'string' ? parseFloat(max) : max // number | undefined

    decimalScale =
      typeof decimalScale === 'number'
        ? Math.round(Math.abs(decimalScale))
        : undefined

    const isUncontrolled = typeof value === 'undefined'

    /* ======================
          state & refs
    ====================== */

    // Used by formatValue() --> formatFixedDecimalScale()
    // Used by handleDeleteOnKeyDown()
    // Used by handleDecimalSeparatorOnKeyDown()
    // Used by handleThousandSeparatorOnKeyDown()
    // Used by useEffect() --> onChange() when formattedValue changes.
    // Used by useEffect() --> calculateCursorPosition()
    // Used by the input's ref, onCut, onPaste, onKeyDown, and onBlur.
    const internalRef = useRef<HTMLInputElement | null>(null)

    // Used to reset cursor when the value is out of range.
    // Set within onKeyDown, onCut, and onPaste.
    //^ But where is it then used?
    const cursorIndexBeforeChange = useRef<number | null>(null)

    // Set within handleChange.
    //^ But where is it then used?
    const cursorIndexAfterChangeRef = useRef<number | null>(null)

    // Used to allow 'Backspace', ⌘+x, or 'cut' on leading '0'.
    // Used by formatValue() --> add0IfStartsWithDecimalSeparator()
    // Used by handleDeleteOnKeyDown()
    // Used by useEffect(() => { deleteRef.current = false }, [formattedValue])
    // Used by onCut prop.
    const deleteRef = useRef(false)

    // Set within handleMinusOnKeyDown().
    // Used by formatValue() --> formatMinuses()
    const hasPreviousMinusRef = useRef<boolean>(undefined)

    //^ Where is this used?
    const overDecimalScaleByRef = useRef(0)

    // Used by handlechange()
    // Used by useEffect() --> calculateCursorPosition()
    const outOfRangeRef = useRef(false)

    // Technically, this is only a ever set within the onChange() and onBlur() handlers.
    const eventRef = useRef<
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>
      | null
    >(null)

    // setFormattedValue is used by handleChange() and onBlur().
    const [formattedValue, setFormattedValue] = useState<string>(() => {
      // The logic here should be very similar to what is done in handleChange().
      const initialValue = formatValue({
        value: (() => {
          if (typeof value === 'string') {
            return value
          }
          if (defaultValue && typeof defaultValue === 'string') {
            return defaultValue
          }
          return ''
        })(),
        // prevValue,
        allowDecimal,
        allowNegative,
        decimalSeparator,
        thousandSeparator,
        decimalScale,
        fixedDecimalScale,
        internalRef,
        cursorIndexAfterChangeRef,
        deleteRef,
        hasPreviousMinusRef,
        overDecimalScaleByRef
      })

      // When clampBehavior === 'strict' we don't actually want to clamp
      // the value. Instead, return early if the value is out of range.
      // Or in this case, just return '' when initializing.

      const isOutOfRange = getIsOutOfRange({
        max: maxNumberOrUndefined,
        min: minNumberOrUndefined,
        value: initialValue
      })

      if (clampBehavior === 'strict' && isOutOfRange) {
        return ''
      }

      return initialValue
    })

    // unformattedvalue is used by useEffect() --> calculateCursorPosition()
    // setUnformattedValue is used by handleChange() and onBlur()
    const [unformattedValue, setUnformattedValue] = useState(formattedValue)

    // formattedCount helps trigger a useEffect() after handleChange and onBlur run, even
    // if the formattedValue doesn't actually change.

    // formattedCount is used in the dependency array of the useEffect() that calls onChange().
    // formattedCount is used in the dependency array of the useEffect() that calls calculateCursorPosition().
    // setFormattedCount is used by handleChange() and onBlur().
    const [formattedCount, setFormattedCount] = useState(0)

    // Used to force a rerender after setting internalRef.current.value
    // within the uncontrolled implementation.
    const [, forceRender] = useReducer((x) => x + 1, 0)

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
            clamp()
    ====================== */
    // Used in onBlur()

    const clamp = (str: string) => {
      // Gotcha: parseFloat('100,000.00') results in 100!
      // This can be mitigated by stripping non numeric characters in advance.
      let newValue: number | string = str.replace(/[^0-9\-.]/g, '')
      newValue = parseFloat(newValue)

      if (
        typeof minNumberOrUndefined === 'number' &&
        newValue < minNumberOrUndefined
      ) {
        newValue = minNumberOrUndefined.toString()
      } else if (
        typeof maxNumberOrUndefined === 'number' &&
        newValue > maxNumberOrUndefined
      ) {
        newValue = maxNumberOrUndefined.toString()
      }

      if (typeof newValue === 'string') {
        // Be aware that when you parseFloat() it will remove any extra zeros,
        // and other formattting. This means that we have to be careful to add
        // back any prefix, suffix, thousandSeparator, trailing zeros, etc.
        // In practice, this means that we probably will need to reapply many
        // of the formatting features here  as well.
        return newValue
      }

      return str
    }

    /* ======================
          handleChange()
    ====================== */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      eventRef.current = e

      const selectionStart = e.target.selectionStart
      if (typeof selectionStart === 'number') {
        cursorIndexAfterChangeRef.current = selectionStart
      }

      const isOutOfRange = getIsOutOfRange({
        max: maxNumberOrUndefined,
        min: minNumberOrUndefined,
        value: e.target.value
      })

      // When clampBehavior === 'strict' we don't actually want to clamp
      // the value. Instead, return early if the value is out of range.
      if (clampBehavior === 'strict' && isOutOfRange) {
        outOfRangeRef.current = true
        setFormattedCount((v) => v + 1) //^ Why is this done here when it's also done below?
        return
      }

      setFormattedValue((prevValue) => {
        const newValue = formatValue({
          value: e.target.value,
          prevValue,
          allowDecimal,
          allowNegative,
          decimalSeparator,
          thousandSeparator,
          decimalScale,
          fixedDecimalScale,
          internalRef,
          cursorIndexAfterChangeRef,
          deleteRef,
          hasPreviousMinusRef,
          overDecimalScaleByRef
        })

        setUnformattedValue(e.target.value) //^ ???
        setFormattedCount((v) => v + 1)
        return newValue
      })
    }

    /* ======================
    handleDeleteOnKeyDown()
    ====================== */
    //^ Needs review.

    const handleDeleteOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      // Allows user to delete a leading "0" by disabling the associated formatting function temporarily.
      if (e.key === 'Backspace' || (e.metaKey && e.key === 'x')) {
        deleteRef.current = true
      }

      // Allow 'Backspace' to skip backward over "0"s that occur AFTER
      // decimalSeparator when fixedDecimalScale is true.
      if (
        allowDecimal &&
        typeof decimalScale === 'number' &&
        fixedDecimalScale === true
      ) {
        const target = internalRef.current

        if (target !== null && e.key === 'Backspace') {
          const dotIndex = target.value.indexOf(decimalSeparator)
          const selectionStart = target.selectionStart
          const selectionEnd = target.selectionEnd

          if (
            dotIndex !== -1 &&
            selectionStart !== null &&
            selectionEnd !== null &&
            // Only call e.preventDefault() on the 'Backspace' when the cursor is before the decimalSeparator.
            selectionStart > dotIndex
          ) {
            // What actually happens in Mantine is the user is allowed to backspace
            // on a fixed decimal, and it will get convert that decimal place to "0".
            // However, if it's already "0", then just move the cursor back by one position.
            const isSingleSelection =
              typeof selectionStart === 'number' &&
              typeof selectionEnd === 'number' &&
              selectionStart === selectionEnd

            if (isSingleSelection) {
              const charToDeleteOrSkip = target.value[selectionStart - 1]
              e.preventDefault()

              // If the character is not '0' or decimalSeparator then replace it with '0'.
              if (
                charToDeleteOrSkip !== '0' &&
                charToDeleteOrSkip !== decimalSeparator
              ) {
                const before = target.value.slice(0, selectionStart - 1)
                const after = target.value.slice(selectionStart)
                const newValue = `${before}0${after}`
                target.value = newValue
              }

              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
            // There shouldn't be a need to run custom logic when isMultiSelection.
            // In that case, just let the default behavior do its thing.
          }
        }
      }
    }

    /* ======================
    handleDecimalSeparatorOnKeyDown()
    ====================== */
    //^ Needs review.

    const handleDecimalSeparatorOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const target = internalRef.current

      if (target && e.key === decimalSeparator) {
        const decimalSeparatorIndex = target.value.indexOf(decimalSeparator)
        const selectionStart = target.selectionStart

        // If there is already a decimalSeparator or if !allowDecimal,
        // then simply call   e.preventDefault()
        if (target.value.includes(decimalSeparator) || !allowDecimal) {
          e.preventDefault()
        }

        // If there is a decimalSeparator and the cursor index is on it, then skip over it.
        if (
          decimalSeparatorIndex !== -1 &&
          typeof selectionStart === 'number' &&
          selectionStart === decimalSeparatorIndex
        ) {
          target.selectionStart = selectionStart + 1
          target.selectionEnd = selectionStart + 1
        }
      }
    }

    /* ======================
      handleMinusOnKeyDown()
    ====================== */

    const handleMinusOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-') {
        if (!allowNegative) {
          e.preventDefault()
        } else {
          // IMMEDIATELY update hasMinusRef based on whether formattedValue has
          // a "-". This must happen with a ref, so it's available BEFORE the onChange
          // runs. Ultimately we want the "-" key to function like a toggle. This ref
          // helps the onChange handler determine how to treat "-" characters.
          hasPreviousMinusRef.current = formattedValue.includes('-')
        }
      }
    }

    /* ======================
    handleThousandSeparatorOnKeyDown()
    ====================== */
    //^ Needs review.

    const handleThousandSeparatorOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const target = internalRef.current

      if (target !== null) {
        const selectionStart = target.selectionStart

        if (typeof selectionStart === 'number') {
          // 1. thousandSeparator : skip forard.
          if (e.key === thousandSeparator) {
            if (target.value[selectionStart] === thousandSeparator) {
              e.preventDefault()
              target.selectionStart = selectionStart + 1
              target.selectionEnd = selectionStart + 1
            }
          }

          // 2. 'Backspace' : skip back
          if (e.key === 'Backspace') {
            if (target.value[selectionStart - 1] === thousandSeparator) {
              e.preventDefault()
              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
          }
        }
      }
    }

    /* ======================
          useEffect()
    ====================== */
    // This useEffect() watches for changes to formattedValue/formattedCount.
    // It's main purpose is to call onChange() whenever formattedValue/formattedCount changes.
    // It's secondary purpose is to also set the input element's value directly when isUncontrolled
    // is detected.

    useEffect(() => {
      // If the implementation is uncontrolled, then set the input through the internalRef.
      if (internalRef.current && isUncontrolled) {
        internalRef.current.value = formattedValue
        // It to work fine, the rendering may be relying on some other state update,
        // or maybe a race condition. To make sure that the value is rendered, call
        // forceRender().
        forceRender()
      }

      // At this point, if the type of the event is 'blur' then return early.
      // This avoids calling onChange() as a result of a 'blur' event.
      if (eventRef.current?.type === 'blur') {
        return
      }

      if (eventRef.current?.type === 'change') {
        onChange?.(eventRef.current)
        return
      }

      // In all other cases call onChange(customEvent) in all other cases.
      // What are all other cases? The only other time that should trigger this
      // useEffect is when the component mounts.
      if (internalRef.current) {
        // Gotcha: Initially, I did this in the customEvent:
        // target: { ...target,  value: formattedValue },
        // That does not work the same as this:
        const target = internalRef.current
        target.value = formattedValue

        const customEvent: ChangeEvent<HTMLInputElement> = {
          bubbles: true,
          cancelable: false,
          currentTarget: target,
          defaultPrevented: false,
          eventPhase: 3,
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          isTrusted: true,
          nativeEvent: new Event('change', { bubbles: true }),

          target: target,
          timeStamp: Date.now(),
          type: 'change',

          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {}
        }

        ///////////////////////////////////////////////////////////////////////////
        //
        // Gotcha: when the component first mounts and you're using react-hook-form, then
        // this onChange() runs BEFORE any watcher in the consuming component:
        //
        // useEffect(() => {
        //   const subscription = watch((values) => {
        //     console.log('watched number:', { number: values.number })
        //   })
        //   return () => subscription.unsubscribe()
        // }, [watch])
        //
        // This is normal useEffect() beavior. The useEffect runs AFTER the render.
        // This means that the useEffect() and watch() subscription will miss the first
        // change. To fix this, you need to implement a useLayoutEffect() in the consuming
        // code inststead.
        //
        ///////////////////////////////////////////////////////////////////////////
        onChange?.(customEvent)
      }

      // If we remove formattedCount here, and we have an uncontrolled consumption,
      // Then 99.23 with a fixed decimal of 2 still allows more decimals.
      // This happens because technially both 99.234, 99.234 and 99.2345 all get
      // formatted to 99.23, so the formattedValue doesn't actually change even
      // though the uncontrolled value is changing. This is why we need formattedCount.

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formattedValue, formattedCount, isUncontrolled])

    /* ======================
          useEffect()
    ====================== */
    //^ Needs review.
    // This useEffect has one responsibility: call calculateCursorPosition()
    // when formattedValue and/or formattedCount updates.
    // useLayoutEffect ???

    useEffect(() => {
      const calculateCursorPosition = () => {
        if (
          !internalRef.current ||
          typeof cursorIndexAfterChangeRef.current !== 'number'
        ) {
          return
        }

        if (
          outOfRangeRef.current === true &&
          typeof cursorIndexBeforeChange.current === 'number'
        ) {
          internalRef.current.setSelectionRange(
            cursorIndexBeforeChange.current,
            cursorIndexBeforeChange.current
          )
          // Reset refs
          outOfRangeRef.current = false
          cursorIndexAfterChangeRef.current = null
          return
        }

        // Suppose you have '1234' and the cursor is in the middle.
        // Then you press '-'. It will add the cursor to the beginning
        // of the string based on the "-" logic defined elsewhere, but
        // the cursor will end up jumping to the end of the string.
        // This fixes that case.
        if (unformattedValue.length === formattedValue.length) {
          //! console.log('Cursor Case 1')
          internalRef.current.setSelectionRange(
            cursorIndexAfterChangeRef.current,
            cursorIndexAfterChangeRef.current
          )
        }

        if (unformattedValue.length > formattedValue.length) {
          //! console.log('Cursor Case 2')
          const diff = unformattedValue.length - formattedValue.length
          // setSelectionRange() is supported in most modern browsers, but check for compatibility if targeting older browsers.
          // The method might not work consistently in certain input types or mobile browsers.

          internalRef.current.setSelectionRange(
            // overDecimalScaleByRef.current is set withinn formatDecimalScale()
            cursorIndexAfterChangeRef.current -
              diff +
              overDecimalScaleByRef.current,
            cursorIndexAfterChangeRef.current -
              diff +
              overDecimalScaleByRef.current
          )
        }

        // Suppose we had '1234' and the cursor is at the very beginning.
        // Then you press the decimalSeparator key (e.g, ".").
        // It will change the string to '0.1234' based on the logic
        // for prepending "0" defined elsewhere, but the cursor will end
        // up jumping to the end of the string. This fixes that case.
        // For example: '.1234' < '0.1234'
        if (unformattedValue.length < formattedValue.length) {
          //! console.log('Cursor Case 3', { unformattedValue, formattedValue })

          const diff = formattedValue.length - unformattedValue.length

          // In cases where the following conditions are true, prevent the diff from being added.
          // Thus if we type a single character, the cursor wil not jump to the end.
          let fixedDecimalScaleDiff = 0
          if (
            unformattedValue.length === 1 &&
            allowDecimal &&
            typeof decimalScale === 'number' &&
            fixedDecimalScale === true
          ) {
            fixedDecimalScaleDiff = diff
          }

          internalRef.current.setSelectionRange(
            cursorIndexAfterChangeRef.current + diff - fixedDecimalScaleDiff,
            cursorIndexAfterChangeRef.current + diff - fixedDecimalScaleDiff
          )
        }

        // Reset ref.
        cursorIndexAfterChangeRef.current = null
      }

      calculateCursorPosition()
    }, [
      formattedValue,
      unformattedValue,
      formattedCount,
      allowDecimal,
      decimalScale,
      fixedDecimalScale
    ])

    /* ======================
          useEffect()
    ====================== */
    // Whenever formattedValue changes set deleteRef.current back to false.

    useEffect(() => {
      deleteRef.current = false
    }, [formattedValue])

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
          // react-hook-form will use ref() to set the value of the input.
          // Consequently, if the consumption is uncontrolled, then value={???} below will
          // end up being overwritten.
          ref={(node) => {
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
          spellCheck={false}
          style={style}
          {...otherProps}
          //# Because this is type="text", we need to make sure that when we implement
          //# the spinner controls that they are also keyboard accessible.
          type='text'
          //^ Needs review.
          onCut={(e) => {
            deleteRef.current = true
            if (internalRef.current !== null) {
              cursorIndexBeforeChange.current =
                internalRef.current.selectionStart
            }
            onCut?.(e)
          }}
          //^ Needs review.
          onPaste={(e) => {
            if (internalRef.current !== null) {
              cursorIndexBeforeChange.current =
                internalRef.current.selectionStart
            }
            onPaste?.(e)
          }}
          // //# Gotcha: Just in case there is also a 'Delete' event we need to check for that in all places as well.
          // //# e.key === "Backspace" || e.key === "Delete" ( ensure compatibility across systems).
          // //# However, this isn't entirely correct. "Delete" deletes in the other direction, so we'd need
          // //# to create entirely separate logic for that. See if Mantine works with it.
          // //#
          // //#  macOS has a separate "Fn + Delete" shortcut to delete characters
          // //# to the right of the cursor, similar to the "Delete" key on Windows.
          // //#
          // //#   Windows: No key directly produces "Delete" in event.key. The key labeled "Delete" on Windows keyboards typically generates an event.key value of "Backspace".
          // //#
          // //#   Mac: "Fn + Delete" combination: This specific shortcut, which deletes characters to the right of the cursor, results in an event.key value of "Delete".

          // //# Mantine does support "Delete" without making the cursor jump to the very end.

          onKeyDown={(e) => {
            if (internalRef.current !== null) {
              cursorIndexBeforeChange.current =
                internalRef.current.selectionStart
            }

            handleDeleteOnKeyDown(e)
            handleDecimalSeparatorOnKeyDown(e)
            handleMinusOnKeyDown(e)
            handleThousandSeparatorOnKeyDown(e)
            onKeyDown?.(e)
          }}
          onBlur={(e) => {
            eventRef.current = e

            const isOutOfRange = getIsOutOfRange({
              max: maxNumberOrUndefined,
              min: minNumberOrUndefined,
              value: e.target.value
            })

            setFormattedValue((prevValue) => {
              let newValue = formatValue({
                value:
                  isOutOfRange && clampBehavior === 'blur'
                    ? clamp(e.target.value)
                    : e.target.value,
                prevValue,
                allowDecimal,
                allowNegative,
                decimalSeparator,
                thousandSeparator,
                decimalScale,
                fixedDecimalScale,
                internalRef,
                cursorIndexAfterChangeRef,
                deleteRef,
                hasPreviousMinusRef,
                overDecimalScaleByRef
              })

              // Remove trailing "."
              if (newValue.endsWith(decimalSeparator)) {
                newValue = newValue.slice(0, -1)
              }
              // Remove solo "-" / "."
              if (newValue === '-' || newValue === decimalSeparator) {
                newValue = ''
              }

              // Convert "-0" to just "0".
              if (strIsZeroLike(newValue)) {
                newValue = newValue.replace(/-/g, '')
              }

              //# Maybe do something here if the value is ONLY prefix/suffix.
              //# But it looks like it may not be necessary.

              if (newValue) setUnformattedValue(e.target.value)
              setFormattedCount((v) => v + 1)
              return newValue
            })

            onBlur?.(e)
          }}
          onChange={handleChange}
          // Even if we just set:  value={formattedValue}, it would NOT
          // be used on mount if RHF is uncontrolled. Why?
          // Because RHF initially sets the value through its ref().
          {...(isUncontrolled ? {} : { value: formattedValue })}
        />
        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

InputNumber.displayName = 'InputNumber'
