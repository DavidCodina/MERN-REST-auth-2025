export const returnString = (value: string): string => {
  if (typeof value !== 'string') {
    throw new Error('The value must be a string.')
  }
  return value
}
