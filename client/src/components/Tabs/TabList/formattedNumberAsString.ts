// Here we explicitly set 0 - 16 to avoid inadvertant rounding
// issues due to "double-precision floating point" behavior
// that occurs beyond the 16th decimal place.
export type AllowedDecimalPlaces =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16

export interface IFormattedNumber {
  /** The number of decimal places to show. Defaults to 2. */
  decimalPlaces?: AllowedDecimalPlaces
  /** Removes trailing zeros from decimal part of number. This process overwrites
   *  (has precedence over) the decimalPlaces prop.
   */
  trimZeros?: boolean
  /** The float or integer value. */
  value: number
}

export interface IOptions {
  decimalPlaces?: AllowedDecimalPlaces
  trimZeros?: boolean
}

/* ========================================================================
                                formattedNumberAsString
======================================================================== */

export function formattedNumberAsString(
  value: number,
  options: IOptions = { trimZeros: false }
): string {
  const resolvedOptions: any = {}

  /* ======================
  Failsafes for non-Typescript environments
  ====================== */

  // Typescript types value to number, but non-TS consuming
  // environments can still get around this. Return early with an
  // 'error' message if value is not a number.
  // One might think to instead throw a runtime error, but that's a bad idea.
  // While that approach is intended to warn the developer during development,
  // it might not be immediately evident, and could actually occur during production.
  if (typeof value !== 'number') {
    console.error(
      'The first argument to formattedNumberAsString must be of type number.'
    )
    return 'number formatting failed!'
  }

  // If decimalPlaces is not set, then set it to the number
  // of decimal places that already exists on the value passed
  // into formattedNumberAsString. Why? Because Intl.NumberFormat will
  // round it to three decimal places if not otherwise told what to do.
  // This could lead to unexpected results.
  if (typeof options.decimalPlaces !== 'number') {
    const stringValue = value.toString()
    const stringValueParts = stringValue.split('.')
    const decimalPart = stringValueParts[1]
    if (decimalPart) {
      // i.e., exists and is greater than zero
      options.decimalPlaces = decimalPart.length as AllowedDecimalPlaces
    }
  }

  // Limit max decimal places to 16 to avoid potential inadvertant
  // rounding due to "double-precision floating point" behavior.
  if (typeof options.decimalPlaces === 'number') {
    if (options.decimalPlaces > 16) {
      options.decimalPlaces = 16
    } else if (options.decimalPlaces < 0) {
      options.decimalPlaces = 0
    }
  }

  /* ======================
        decimalPlaces
  ====================== */

  if (typeof options.decimalPlaces === 'number') {
    resolvedOptions.minimumFractionDigits = options.decimalPlaces
    resolvedOptions.maximumFractionDigits = options.decimalPlaces
  }

  /* ======================
          formatter
  ====================== */

  const formatter = new Intl.NumberFormat('en-US', resolvedOptions)
  const formattedValue = formatter.format(value)

  /* ======================
         trimZeros
  ====================== */
  // This will overwrite (take precedence over) decimalPlaces such
  // that there may not necessarily be the minimum number of decimal places.

  if (options.trimZeros === true && formattedValue.includes('.')) {
    const formattedValueParts = formattedValue.split('.')

    // If for some reason there's not exactly two parts then skip.
    if (formattedValueParts.length === 2) {
      const integerPart = formattedValueParts[0]
      let decimalPart = formattedValueParts[1]

      while (decimalPart?.endsWith('0')) {
        decimalPart = decimalPart.slice(0, -1)
      }

      // Suppose the consumer did this:
      // formattedNumberAsString(1000.001, { decimalPlaces: 2, trimZeros: true })
      // It would result in: '1,000.'
      // Do a final check for ending '.' and remove it.
      let result = `${integerPart}.${decimalPart}`

      if (result.endsWith('.')) {
        result = result.substring(0, result.length - 1)
      }

      return result
    }
  }

  /* ======================
          return
  ====================== */

  return formattedValue
}
