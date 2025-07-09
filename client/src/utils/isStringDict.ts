export const isStringDict = (
  value: unknown
): value is Record<string, string> => {
  const isObject = typeof value === 'object' && value !== null
  if (!isObject) {
    return false
  }

  return Object.values(value).every((v) => typeof v === 'string')
}
