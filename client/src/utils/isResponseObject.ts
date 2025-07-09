// This should also be defined in src/types. However, I've duplicated
// it here so that this utility is portable.
type ResponseObject<T = unknown> = {
  data: T
  message: string
  success: boolean
  errors?: Record<string, string> | null
}

/* ======================

====================== */

const isStringDict = (value: unknown): value is Record<string, string> => {
  const isObject = typeof value === 'object' && value !== null
  if (!isObject) {
    return false
  }

  return Object.values(value).every((v) => typeof v === 'string')
}

/* ========================================================================

======================================================================== */

export const isResponseObject = (value: unknown): value is ResponseObject => {
  const isObject = typeof value === 'object' && value !== null
  if (!isObject) {
    return false
  }

  const isData = 'data' in value
  const isMessage = 'message' in value && typeof value.message === 'string'
  const isSuccess = 'success' in value && typeof value.success === 'boolean'

  const isErrorsOrUndefined = (() => {
    if (!('errors' in value)) {
      return true
    }

    return isStringDict(value.errors)
  })()

  return isData && isMessage && isSuccess && isErrorsOrUndefined
}
