/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   throw new CustomError({
//     code: 'BAD_REQUEST', // Optional
//     message: 'Unable to get posts.'
//     name: 'CustomError' // Optional, generally not needed.
//   })
//
// This class is especially useful in conjunction with libraries like
// Tanstack Query, where you want to leverage the libraries error
// capabilities, but you may also want your Error to contain additional info.
//
// Using CustomErrorConfig rather than individual args: code, message, name is better
// because it helps the consumer know exactly what's needed.
//
///////////////////////////////////////////////////////////////////////////

type CustomErrorConfig = { code?: string; message: string; name?: string }
export class CustomError extends Error {
  public code?: string

  constructor({ code, message, name }: CustomErrorConfig) {
    super(message)

    if (code && typeof code === 'string') {
      this.code = code
    }

    if (name && typeof name === 'string') {
      this.name = name
    }
  }
}
