// isValidTimezone will return true for all valid IANA timezones.
// This function is used internally, but also re-exported for external validation.
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch (_err) {
    // e.g., RangeError: Invalid time zone specified: America/Nowhere
    return false
  }
}

// There are currently 418 timezones.
// function _getAllTimezones(): string[] {
//   try {
//     // Typescript not to complain, you may need to update tsconfig.json to
//     //  "lib": ["ES2022", "DOM", "DOM.Iterable"],
//     return Intl.supportedValuesOf('timeZone')
//   } catch (error) {
//     console.error('Intl.supportedValuesOf is not supported in this environment')
//     return []
//   }
// }
