import {
  numericFormatter
  // NumberFormatValues
} from 'react-number-format'

/* ======================
   stripNonNumeric
====================== */

export const stripNonNumeric = ({
  decimalSeparator = '.',
  value
}: {
  decimalSeparator: string
  value: string
}) => {
  const regex = new RegExp(`[^0-9\\-${decimalSeparator}]`, 'g')
  return value.replace(regex, '')
}

/* ======================
   formatLeadingZeros()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Bing's ChatGPT AI struggled to get all of the piecs of this function correct.
// Ultimately, I had to tweak it a little. Once I had the correct definition, I then
// gave the funcion back to AI and asked it to reverse-engineer a prompt plain english
// that would result in the function. You can't use the function itself as the prompt.
// It's interesting to see because it can teach you how to create better prompts:
//
//   "Write a function that takes a string as input and returns the same string with any leading zeros removed.
//   If the input string starts with a minus sign, the output string should also start with a minus sign.
//   If the input string consists of only zeros, the output string should be ‘0’.
//   If the input string starts with more than one zero, the output string should start with only one zero.
//   If the input string starts with a zero followed by a digit other than a decimal point,
//   the output string should not start with a zero.
//   The function should be named removeLeadingZeros and should take a single parameter of type string.
//   The function should return a string.""
//
///////////////////////////////////////////////////////////////////////////

export const formatLeadingZeros = ({
  decimalSeparator = '.',
  value
}: {
  decimalSeparator: string
  value: string
}): string => {
  let emptyOrMinus: '' | '-' = ''

  if (value.startsWith('-')) {
    emptyOrMinus = '-'
    value = value.slice(1)
  }

  // If the value does not start with a '0', then simply prepend emptyOrMinus to value and return.
  if (!value.startsWith('0')) {
    return `${emptyOrMinus}${value}`
  }

  // Remove consecutive zeros.
  while (value.startsWith('00')) {
    value = value.slice(1)
  }

  // Here we know that the value will start with a '0'.
  // However, we want to allow '0.', '0.25', etc.
  // If it's anything besides '0.' variation then cut off the leading '0'
  if (value.length > 1 && value[1] !== decimalSeparator) {
    value = value.slice(1)
  }

  return `${emptyOrMinus}${value}`
}

/* ======================
    getIsOutOfRange()
====================== */

export const getIsOutOfRange = ({
  max,
  min,
  value
}: {
  max: number | undefined
  min: number | undefined
  value: string | number
}) => {
  if (typeof value === 'string' && value.trim() === '') {
    return false
  }
  const valueAsNumber =
    typeof value === 'number'
      ? value
      : // Gotcha: parseFloat('100,000.00') results in 100!
        // This can be mitigated by stripping non numeric characters in advance.
        parseFloat(value.replace(/[^0-9\-.]/g, ''))

  const tooLow = typeof min === 'number' && valueAsNumber < min ? true : false
  const tooHigh = typeof max === 'number' && valueAsNumber > max ? true : false
  if (tooLow || tooHigh) {
    return true
  }
  return false
}

/* ======================
    numberOrUndefined()
====================== */

export const numberOrUndefined = (
  value: string | number | undefined
): number | undefined => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value
  }

  if (typeof value === 'string') {
    const maybeFloat = parseFloat(value)

    if (!isNaN(maybeFloat)) {
      return maybeFloat
    }
  }

  // If the value was not 'string' or 'number' return undefined.
  // If the value was an unparseable string or a NaN number return undefined.
  // If the value was undefined return undefined.
  return undefined
}

/* ======================
         clamp()
====================== */

export const clamp = ({
  value,
  min,
  max,
  decimalSeparator = '.'
}: {
  value: string
  min?: number
  max?: number
  decimalSeparator?: string
}): string => {
  // Gotcha: parseFloat('100,000.00') results in 100!
  // This can be mitigated by stripping non numeric characters in advance.

  const replacePattern = new RegExp(`[^0-9\\${decimalSeparator}-]`, 'g')
  let newValue: number | string = value.replace(replacePattern, '')

  if (decimalSeparator !== '.') {
    newValue = newValue.replace(decimalSeparator, '.')
  }

  newValue = parseFloat(newValue)

  if (typeof min === 'number' && !isNaN(newValue) && newValue < min) {
    newValue = min.toString()
  } else if (typeof max === 'number' && !isNaN(newValue) && newValue > max) {
    newValue = max.toString()
  }

  if (typeof newValue === 'string') {
    // Be aware that when you parseFloat() it will remove any extra zeros,
    // and other formattting. This means that we have to be careful to add
    // back any prefix, suffix, thousandSeparator, trailing zeros, etc.
    // In practice, this means that we probably will need to reapply many
    // of the formatting features here  as well.
    return newValue
  }

  return value
}

/* ======================
getCountOfLeadingZeros()
====================== */

export const getCountOfLeadingZeros = ({
  value,
  decimalSeparator = '.',
  prefix = ''
}: {
  value: string
  decimalSeparator?: string
  prefix?: string
}) => {
  if (typeof value !== 'string') {
    return 0
  }

  // Strip the leading '-'
  if (value.startsWith('-')) {
    value = value.slice(1)
  }

  // Strip the prefix if it exists
  if (prefix && value.startsWith(prefix)) {
    value = value.slice(prefix.length)
  }

  // Clean the string by removing any non-numeric characters except the decimal separator
  const replacePattern = new RegExp(`[^0-9\\${decimalSeparator}]`, 'g')
  value = value.replace(replacePattern, '')

  // Replace the decimal separator with '.' if it's different
  if (decimalSeparator !== '.') {
    value = value.replace(decimalSeparator, '.')
  }

  // For cases where the leading zero is '0' or '0.', don't count it.
  // A leading zero in this context is considered somethign like: '01.23', '00.00', etc.
  if (value === '0' || value.startsWith('0.')) {
    return 0
  }

  // Count the leading zeros
  let leadingZerosCount = 0
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '0') {
      leadingZerosCount++
    } else {
      break
    }
  }

  return leadingZerosCount
}

/* ======================
createValuesAndSourceInfo()
====================== */

type FormatterConfig = {
  allowNegative: boolean
  decimalScale?: number
  decimalSeparator: string
  fixedDecimalScale: boolean
  prefix?: string
  suffix?: string
  thousandSeparator?: string | boolean
}

export const createValuesAndSourceInfo = (
  value: string, // e.g., internalValue (string), maxNumberOrUndefined.toString(), minNumberOrUndefined.toString()
  {
    allowNegative,
    decimalScale,
    decimalSeparator,
    fixedDecimalScale,
    prefix,
    suffix,
    thousandSeparator
  }: FormatterConfig
) => {
  // Gotcha: a value of '$0.25' will result in a formattedValue of '$$0,25'
  // To mitigate this, we need to clean the value BEFORE passing it into numericFormatter()
  const formattedValue = numericFormatter(
    stripNonNumeric({
      value: value,
      decimalSeparator: decimalSeparator
    }),
    {
      // While isAllowed and allowLeadingZeros can be passed in according to
      // the Typesript definition, actually neither has any effect. However,
      // the initalValue of internalValue does an allowLeadingZeros and uses
      // a custom formatLeadingZeros() function to strip out leading zeros.
      // This means that we shoulnd't need to worry about it at this point.
      allowNegative: allowNegative,
      decimalScale: decimalScale,
      decimalSeparator: decimalSeparator,
      fixedDecimalScale: fixedDecimalScale,
      prefix: prefix,
      suffix: suffix,
      thousandSeparator: thousandSeparator
      // thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan' | 'none';
    }
  )

  // react-number-format does not provide a single utility function that directly
  // returns all three values: { floatValue, formatteValue, value }. The other two,
  // you'll need to derive manually from the formattedValue.

  // cleanedValue strips prefix, suffix, thousandSeparator, and replaces
  // any custom decimalSeparator with the standard '.'.
  let cleanedValue = stripNonNumeric({
    value: formattedValue,
    decimalSeparator: decimalSeparator
  })

  // At this point, it's possible that cleanedValue still has a wacky decimalSeparator.
  // If decimalSeparator is not '.', then we need to manually replace decimalSeparator with '.'.
  if (decimalSeparator !== '.') {
    cleanedValue = cleanedValue.replace(decimalSeparator, '.')
  }

  const floatValue = numberOrUndefined(cleanedValue)
  const values = { formattedValue, value: cleanedValue, floatValue }
  // See here around line 292. Mantine uses 'as any' to pass custom sourceInfo.source values
  // https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/NumberInput/NumberInput.tsx
  // A better approach is to instead have a CustonOnValueChange type.
  const sourceInfo = { event: undefined, source: 'programmatic' }

  return { values, sourceInfo }
}

/* ======================
      prependZero()
====================== */

type PrependZeroConfig = {
  decimalSeparator: string
  prefix?: string
  value: string
}

export const needsZero = ({
  decimalSeparator = '.',
  prefix = '',
  value
}: PrependZeroConfig) => {
  if (
    typeof value === 'string' &&
    (value.startsWith(`-${prefix}${decimalSeparator}`) ||
      value.startsWith(`${prefix}${decimalSeparator}`) ||
      value.startsWith(`-${decimalSeparator}`) ||
      value.startsWith(decimalSeparator))
  ) {
    return true
  }
  return false
}

export const prependZero = ({
  decimalSeparator = '.',
  prefix = '',
  value
}: PrependZeroConfig) => {
  const prefixLength = typeof prefix === 'string' ? prefix.length : 0

  if (needsZero({ decimalSeparator, prefix, value })) {
    console.log('It needs a zero...')
    const index = value.indexOf(decimalSeparator, prefixLength)
    return value.slice(0, index) + '0' + value.slice(index)
  }

  return value
}
