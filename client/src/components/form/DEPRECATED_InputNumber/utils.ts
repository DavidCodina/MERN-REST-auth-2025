/* ======================
1. stripNonNumeric
====================== */

const stripNonNumeric = ({
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
2. formatDecimalSeparator
====================== */

const truncateFloatToInteger = ({
  decimalSeparator = '.',
  value
}: {
  decimalSeparator: string
  value: string
}) => {
  // Split on decimalSeparator (e.g., '.') and return the [0] part.
  // Do not merely do a value.replace(/ ... /g, '').
  // Why? The latter approach would lead to unexpected
  // results if the user was pasting a value in.
  const integer = value.split(decimalSeparator)[0]
  value = typeof integer === 'string' ? integer : value
  return value
}

///////////////////////////////////////////////////////////////////////////
//
// Note: this works in conjunction with logic in onKeyDown that prevents
// multiple dots.
//
//   if (target && e.key === decimalSeparator) {
//     if (target.value.includes(decimalSeparator)) {
//       console.log(`There's already one "${decimalSeparator}"`)
//       e.preventDefault()
//     }
//   }
//
// However, this is also necessary for paste jobs.
//
///////////////////////////////////////////////////////////////////////////

const formatDecimalSeparator = ({
  allowDecimal,
  decimalSeparator = '.',
  value
}: {
  allowDecimal: boolean
  decimalSeparator: string
  value: string
}) => {
  // Following the behavior of Mantine's NumberInput, if !allowDecimal,
  // then strip strip out the "." AND everything after it. Do not round
  // the number, simply truncate it. Note that the onKeyDown handler also
  // calls e.preventDefault() when !allowDecimal && e.key === '.'. This
  // helps prevent the current logic from converting '100000' to '100' if
  // the '.' is added in the middle of the string.
  if (!allowDecimal) {
    return truncateFloatToInteger({
      value,
      decimalSeparator
    })
  }

  const firstDotIndex = value.indexOf(decimalSeparator)
  // If there's no "." or only one "." in the string, return the original string
  if (
    firstDotIndex === -1 ||
    firstDotIndex === value.lastIndexOf(decimalSeparator)
  ) {
    return value
  }
  // If there are multiple ".", create a new string without subsequent "."
  // 9....25 => 9.25
  // Here the first part would be '9.', and the second part would be '25'.
  return (
    value.slice(0, firstDotIndex + 1) +
    value.slice(firstDotIndex + 1).replace(/\./g, '')
  )
}

/* ======================
3. formatMinuses()
====================== */
// This function is dependent on handleMinusOnKeyDown()

const formatMinuses = ({
  allowNegative,
  hasPreviousMinusRef,
  value
}: {
  allowNegative: boolean
  hasPreviousMinusRef: React.MutableRefObject<boolean | undefined>
  value: string
}) => {
  // If the value has a minus already or if minus is not allowed, then strip all minuses.
  // This ultimately results in the "-" key working like a toggle. This behavior is similar
  // to what Mantine's NumperInput does.
  if (hasPreviousMinusRef.current === true || !allowNegative) {
    hasPreviousMinusRef.current = undefined
    return value.replace(/-/g, '')
  }

  // If the value has no minuses in it, then simply return the value.
  if (!value.includes('-')) {
    hasPreviousMinusRef.current = undefined
    return value
  }

  // If the value does have a minus, but no previous minus, then
  // strip al minuses and prepend a single "-" to the beginning.
  hasPreviousMinusRef.current = undefined
  return `-${value.replace(/-/g, '')}`
}

/* ======================
4. formatLeadingZeros()
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

const formatLeadingZeros = ({
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
5. add0IfStartsWithDecimalSeparator
====================== */

const add0IfStartsWithDecimalSeparator = ({
  decimalScale,
  decimalSeparator = '.',
  deleteRef,
  fixedDecimalScale,
  prevValue,
  value
}: {
  value: string
  deleteRef: React.MutableRefObject<boolean>
  decimalSeparator: string
  decimalScale: number | undefined
  fixedDecimalScale: boolean
  prevValue?: string
}) => {
  if (
    // If user presses delete/backspace, ⌘+x, or opens context menu, then set
    // deleteRef.current is set to true. Then here we check deleteRef and
    // conditionally return value (i.e., return early) from the function body.
    // This makes the zero-adding feature less aggressive and allows user
    // to backspace on it. However, IF the prevValue already started with
    // '.' or '-.' then add the '0' then don't return early.
    deleteRef.current === true &&
    //# Eventually also do a !prevValue?.startsWith(`${prefix}`) || !prevValue?.startsWith(`-${prefix}`)
    (!prevValue?.startsWith(decimalSeparator) ||
      !prevValue?.startsWith(`-${decimalSeparator}`))
  ) {
    return value
  }

  if (value === decimalSeparator || value === `-${decimalSeparator}`) {
    // This is consistent with how Mantine's NumberInput behaves.
    return fixedDecimalScale === true && typeof decimalScale === 'number'
      ? `0${decimalSeparator}`
      : value

    // Why not split this up so it also returns "-0"?
  } else if (
    value === `${decimalSeparator}0` ||
    value === `-${decimalSeparator}0`
  ) {
    return '0'
  } else if (value.startsWith(decimalSeparator)) {
    return '0' + value
  } else if (value.startsWith(`-${decimalSeparator}`)) {
    return '-0' + value.substring(1)
  } else {
    return value
  }
}

/* ======================
6. formatDecimalScale()
====================== */
// Expected behavior: If the value is '100000' and a '.' is
// inserted in the middle, it WILL turn it into '100.00'.
// In Mantine, what actually happens is it turns it into '100',
// which seems wrong.

const formatDecimalScale = ({
  decimalScale,
  decimalSeparator = '.',
  overDecimalScaleByRef,
  value
}: {
  decimalScale: number | undefined
  decimalSeparator: string
  overDecimalScaleByRef: React.MutableRefObject<number>
  value: string
}) => {
  if (typeof decimalScale !== 'number') {
    return value
  }

  // Find the first decimal point
  const decimalSeparatorIndex = value.indexOf(decimalSeparator)

  // If there is no decimal point, return the original string
  if (decimalSeparatorIndex === -1) {
    return value
  }

  // This ref is used to track the amount by which value exceeds the
  // decimalScale. That number is then added back to a diff which sets
  // a selection range. It prevents the diff from being too large.
  const decimalPart = value.split(decimalSeparator)[1]
  if (decimalPart && decimalPart.length > decimalScale) {
    overDecimalScaleByRef.current = decimalPart.length - decimalScale
  } else {
    overDecimalScaleByRef.current = 0
  }

  // Return the string with the specified number of decimal places
  return value.slice(0, decimalSeparatorIndex + 1 + decimalScale)
}

/* ======================
7. formatFixedDecimalScale()
====================== */

const appendZeros = ({
  decimalScale,
  decimalSeparator = '.',
  value
}: {
  decimalScale: number
  decimalSeparator: string
  value: string
}) => {
  // Find the index of the decimal point
  const decimalSeparatorIndex = value.indexOf(decimalSeparator)

  // If there's no decimal point:
  if (decimalSeparatorIndex === -1) {
    // Append a decimal point followed by the required number of zeros
    return value + decimalSeparator + '0'.repeat(decimalScale)
  }

  // If there are fewer characters after the decimal point than the desired decimalScale:
  const numDecimalPlaces = value.length - decimalSeparatorIndex - 1
  if (numDecimalPlaces < decimalScale) {
    // Append the required number of zeros
    return value + '0'.repeat(decimalScale - numDecimalPlaces)
  }

  // Otherwise, return the string as is
  return value
}

const formatFixedDecimalScale = ({
  allowDecimal,
  cursorIndexAfterChangeRef,
  decimalScale,
  decimalSeparator = '.',
  fixedDecimalScale,
  internalRef,
  value
}: {
  allowDecimal: boolean
  cursorIndexAfterChangeRef: React.MutableRefObject<number | null>
  decimalScale: number | undefined
  decimalSeparator: string
  fixedDecimalScale: boolean
  internalRef: React.MutableRefObject<HTMLInputElement | null>
  value: string
}) => {
  if (
    !allowDecimal ||
    typeof decimalScale !== 'number' ||
    fixedDecimalScale !== true
  ) {
    return value
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // With Mantine the cursor gets placed back to WHERE IT WOULD HAVE BEEN.
  // Here we accomplish that behavior through setting cursorIndex to a
  // cursorIndexAfterChangeRef, then settting the cursor to that index in a useEffect()
  // that runs when formattedValue changes.
  //
  // Mantine also handles the delete (and/or cut command) differently
  // for this implementation. If you try to delete a decimal place or the decimal point,
  // it simply moves the cursor back on position.
  // Presumably, this would occur by controlling the delete button,
  // but similar behavior also occurs with the cut command.
  //
  ///////////////////////////////////////////////////////////////////////////

  const cursorIndex = (() => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // In Mantine when you have a fixedDecimalScale and you
    // type a single "." it will convert it to "0.00" and place the cursor
    // at the beginning of the string. In order to get this behavior in
    // this component, the add0IfStartsWithDot() has a check that does this
    //
    //   if (value === decimalSeparator || value === `-${decimalSeparator}`) {
    //     return fixedDecimalScale === true && typeof decimalScale === 'number' ? `0${decimalSeparator}` : str
    //   }
    //
    // The difference being that the following logic will result in the cursor being
    // placed just after the ".", which actually seems better (i.e., more expected).
    //
    ///////////////////////////////////////////////////////////////////////////

    // If there was no ".", then place cursor just before "."
    if (!value.includes(decimalSeparator)) {
      return value.length
    }
    // If value ended in "." then place the cursor just after "."
    if (value.endsWith(decimalSeparator)) {
      return value.length
    }
    // Otherwise, place the cursor at the last known position.
    return internalRef.current
      ? internalRef.current.selectionStart
      : value.length
  })()

  value = appendZeros({
    decimalScale,
    decimalSeparator,
    value
  })

  //# Test against multi-character selection + cut or paste
  //# I may need to ref out .selectionEnd as well.
  // Set cursorIndexAfterChangeRef.current. This will be consumed by
  // a useEffect() that runs when formattedValue state changes.
  cursorIndexAfterChangeRef.current = cursorIndex

  return value
}

/* ======================
8. addThousandSeparator()
====================== */
// This function is designed specifically to test whether a string is
// able to be coerced to a valid number. There are some gotchas when
// testing if a value is number like. For example, Number(''), Number(null),
// Number(true), Number(false) all return a number, so would ultimately return
// true when tested with !isNaN( ... ). However, in this case, we're explicitly
// testing only strings.

const strIsNumberLike = (value: string) => {
  if (typeof value !== 'string') {
    return false
  }
  const strAsNumber = Number(value)
  return !isNaN(strAsNumber)
}

export function addThousandSeparator({
  decimalSeparator = '.',
  thousandSeparator = '',
  value
}: {
  decimalSeparator: string
  thousandSeparator?: string
  value: string
}) {
  if (
    !thousandSeparator ||
    typeof thousandSeparator !== 'string' ||
    thousandSeparator.length > 1
  ) {
    return value
  }

  if (
    typeof value !== 'string' ||
    value.trim() === '' ||
    !strIsNumberLike(value)
  ) {
    return value
  }

  const firstDecimalSeparatorIndex = value.indexOf(decimalSeparator)
  const hasDot = firstDecimalSeparatorIndex !== -1

  //# We may need to perform similar logic for prefix/suffix when the time comes.
  const firstMinusIndex = value.indexOf('-')
  const hasMinus = firstMinusIndex !== -1
  value = value.replace(/-/g, '')

  const [integerPart, decimalPart] = value.split(decimalSeparator) as [
    string,
    string
  ]

  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, I was doing this, which worked fine when the thousandsSeparator
  // was only ever a comma.
  //
  //  const formattedIntegerPart = Number(integerPart).toLocaleString()
  //
  // But ultimately, we want the separator to be changeable.
  // There was also a potential gotcha with Number('').
  // What happens here if we had passed in an empty string?
  // It would coerce an empty string to 0. That was ultimately
  // remedied by the conditional early return above. In any case,
  // this is the new logic:
  //
  //
  ///////////////////////////////////////////////////////////////////////////

  let formattedIntegerPart = ''
  let count = 0
  for (let i = integerPart.length - 1; i >= 0; i--) {
    count++
    formattedIntegerPart = integerPart[i] + formattedIntegerPart
    if (count % 3 === 0 && i !== 0) {
      formattedIntegerPart = thousandSeparator + formattedIntegerPart
    }
  }

  if (decimalPart) {
    return `${hasMinus ? '-' : ''}${formattedIntegerPart}.${decimalPart}`
  } else if (hasDot) {
    return `${hasMinus ? '-' : ''}${formattedIntegerPart}.`
  }

  return `${hasMinus ? '-' : ''}${formattedIntegerPart}`
}

/* ======================
    onBlur helpers
====================== */

export const strIsZeroLike = (str: string) => {
  if (typeof str !== 'string') {
    return false
  }
  const strAsNumber = parseFloat(str.replace(/[^0-9\-.]/g, ''))
  return strAsNumber === 0
}

/* ======================
    getIsOutOfRange()
====================== */
// Be careful in handleChange to not run this when value is '',
// or otherwise capable of resuting in NaN.

export const getIsOutOfRange = ({
  max,
  min,
  value
}: {
  max: number | undefined
  min: number | undefined
  value: string | number
}) => {
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

/* ========================================================================
                              formatValue()
======================================================================== */
// formatValue takes in an object which includes the unformatted value
// plus a bunch of configuration options.

type formatValueConfig = {
  allowDecimal: boolean
  allowNegative: boolean
  cursorIndexAfterChangeRef: React.MutableRefObject<number | null>
  decimalScale: number | undefined
  decimalSeparator: string
  deleteRef: React.MutableRefObject<boolean>
  fixedDecimalScale: boolean
  hasPreviousMinusRef: React.MutableRefObject<boolean | undefined>
  internalRef: React.MutableRefObject<HTMLInputElement | null>
  overDecimalScaleByRef: React.MutableRefObject<number>
  prevValue?: string
  thousandSeparator: string | undefined
  value: string
}

export const formatValue = ({
  allowDecimal,
  allowNegative,
  cursorIndexAfterChangeRef,
  decimalScale,
  decimalSeparator = '.',
  deleteRef,
  fixedDecimalScale,
  hasPreviousMinusRef,
  internalRef,
  overDecimalScaleByRef,
  prevValue = '', //^ Is there any danger in defaulting to ''?
  thousandSeparator,
  value
}: formatValueConfig) => {
  value = value.trim()
  if (value === '') {
    return ''
  }

  // Here the order of operations matters.

  value = stripNonNumeric({ value, decimalSeparator })

  value = formatDecimalSeparator({
    allowDecimal,
    decimalSeparator,
    value
  })

  value = formatMinuses({
    allowNegative,
    hasPreviousMinusRef,
    value
  })

  value = formatLeadingZeros({
    decimalSeparator,
    value
  })

  value = add0IfStartsWithDecimalSeparator({
    deleteRef,
    decimalSeparator,
    decimalScale,
    fixedDecimalScale,
    prevValue,
    value
  })

  value = formatDecimalScale({
    decimalScale,
    decimalSeparator,
    overDecimalScaleByRef,
    value
  })

  value = formatFixedDecimalScale({
    allowDecimal,
    cursorIndexAfterChangeRef,
    decimalScale,
    decimalSeparator,
    fixedDecimalScale,
    internalRef,
    value
  })

  value = addThousandSeparator({
    decimalSeparator,
    thousandSeparator,
    value
  })

  return value
}
