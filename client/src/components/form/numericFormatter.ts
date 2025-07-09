// numericFormatter is an alias for the format() function found here:
// https://github.com/s-yadav/react-number-format/blob/master/src/numeric_format.tsx
// It may not actually support allowLeadingZeros.
// It definitely does not support isAllowed.
import { numericFormatter as reactNumericFormatter } from 'react-number-format'

/* ======================
        clamp()
====================== */
// Clamp will remove all formatting.
// For the most part the reactNumericFormatter will add it back as needed.
//# However, it will NOT add back leading/trailings zeros.
//# You may want to check for leading/trialing zeros (before clamp) and manually prepend/append them (after clamp).

const clamp = ({
  value,
  min,
  max
}: {
  value: string
  min?: number
  max?: number
}) => {
  // Gotcha: parseFloat('100,000.00') results in 100!
  // This can be mitigated by stripping non numeric characters in advance.
  let newValue: number | string = value.replace(/[^0-9\-.]/g, '')
  //^ Beware that when you parseFloat() it will remove any extra leading/trailing zeros.
  //^ Well if we have a fixedDecimalScale, it will add back trailing zeros.
  //^ But if we have neither decimalScale nor fixedDecimalScale, then it will just strip them.
  //^ In that case, we probably want to add them back.
  newValue = parseFloat(newValue)

  if (typeof min === 'number' && newValue < min) {
    newValue = min.toString()
  } else if (typeof max === 'number' && newValue > max) {
    newValue = max.toString()
  }

  if (typeof newValue === 'string') {
    return newValue
  }

  return value
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This formatter is built on top of react-number-format's numericFormatter.
// It adds min/max clamping...
// It allows the value arg to be a number, but will still be returned as a string.
//
// Usage:
//
//   const formattedValue = numericFormatter('-1234', {
//     allowNegative: false,
//     decimalScale: 2,
//     decimalSeparator: '.',
//     fixedDecimalScale: true,
//     prefix: '$',
//     suffix: ' USD',
//     thousandSeparator: ',',
//     min: -100,
//     max: 1000
//   })
//
//   console.log('formattedValue:', formattedValue) // Expected: '$1,000.00 USD'
//
///////////////////////////////////////////////////////////////////////////

//# Review : // https://github.com/s-yadav/react-number-format/blob/master/src/numeric_format.tsx
//# See if allowLeadingZeros is actually supported.

type Options = {
  //! Infer this from min/max like InputNumber does.
  allowNegative?: boolean
  decimalScale?: number
  decimalSeparator?: string
  fixedDecimalScale?: boolean
  prefix?: string
  suffix?: string
  thousandSeparator?: string
  min?: number
  max?: number
}

export const numericFormatter = (
  value: string | number,
  {
    allowNegative = true,
    decimalScale,
    decimalSeparator,
    fixedDecimalScale = false,
    prefix,
    suffix,
    thousandSeparator,
    min,
    max
  }: Options
) => {
  // shouldClamp is inferred from min/max being defined.
  const shouldClamp = typeof min !== 'undefined' || typeof max !== 'undefined'

  //# Make sure value is number-like...
  let stringValue = typeof value === 'string' ? value : value.toString()

  if (shouldClamp) {
    // Gotcha: If !allowNegative, make sure to strip the '-' BEFORE clamping.
    // Otherwise, you end up with some very unintuitive results.
    if (allowNegative === false) {
      stringValue = stringValue.replace(/^-/, '')
    }

    stringValue = clamp({
      value: stringValue,
      min,
      max
    })
  }

  // https://s-yadav.github.io/react-number-format/docs/numeric_format#numericformatter-numstring-string-props-numericformatprops--string
  const formattedValue = reactNumericFormatter(stringValue, {
    // While isAllowed and allowLeadingZeros can be passed in according to
    // the Typesript definition, actually neither has any effect.
    allowNegative: allowNegative,
    decimalScale: decimalScale,
    decimalSeparator: decimalSeparator,
    fixedDecimalScale: fixedDecimalScale,
    prefix: prefix,
    suffix: suffix,
    thousandSeparator: thousandSeparator
    // # thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan' | 'none';
  })

  return formattedValue
}
