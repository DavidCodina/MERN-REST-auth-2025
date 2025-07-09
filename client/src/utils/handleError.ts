import { codes } from './codes'

/** A client-side utilty for returning a standardized response from within a client API function's catch block. */
export const handleError = (err: unknown) => {
  // If in development, log error info for debugging..
  if (import.meta.env.DEV === true) {
    if (err instanceof Error) {
      console.log({ name: err.name, message: err.message })
    } else {
      console.log(err)
    }
  }

  return {
    code: codes.INTERNAL_SERVER_ERROR,
    data: null,
    message: 'Internal server error.',
    success: false
  }
}
