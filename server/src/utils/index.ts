import { Response } from 'express'
import { ResBody } from 'types'

export * from './db'
export * from './zod'
export * from './randomFail'
export * from './isPromise'
export * from './codes'
export * from './token'
export * from './decodeJWT'

/* ======================
        sleep()
====================== */
// Used in API calls to test/simulate a slow call
// Example: await sleep(4000)

export const sleep = async (delay = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delay)) // eslint-disable-line
}

/* ======================
      isOneOf()
====================== */
// Used as a conditional check in if statements to determine
// if the value is one of an array of allowedValues.

export const isOneOf = (value: any, allowedValues: any[]) => {
  if (allowedValues.indexOf(value) !== -1) {
    return true
  }
  return false
}

/* ======================
     getErrorMessage
====================== */
// This is for getting error messages in the client.

export const getErrorMessage = (
  err: Record<any, any> | null,
  fallBackMessage = 'The request failed!'
) => {
  if (err === null) {
    return fallBackMessage
  }
  return err?.response?.data?.message
    ? err?.response?.data?.message
    : err.message
      ? err.message
      : fallBackMessage
}

/* ======================
    transformToSlug()
====================== */

export const transformToSlug = (str: string) => {
  if (!str || typeof str !== 'string') {
    return str
  }

  const transformed = str
    .replaceAll(/[^a-zA-Z0-9 ]/g, '')
    .replaceAll(' ', '-')
    .toLowerCase()

  return transformed
}

/* ======================
    propInObj()
====================== */
// https://dmitripavlutin.com/check-if-object-has-property-javascript/
export const propInObj = (prop: string, obj: Record<any, any>) => {
  return prop in obj
}

/* ======================
      stripObj()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Inspired by Zod's default parsing behavior of stripping
// a raw data object of any properties not defined by the
// schema. Incidentally, Mongoose also does this against
// it's own schema. Thus, this function would generally
// not be needed, but it's a nice-to-have.
//
// This function takes in an object an an array of allowedKeys.
// It returns a NEW object with only the allowed keys. Example:
//
//   const object = { name: 'David', age: 45 }
//   const allowedKeys = ['name']
//   const strippedObject = stripObject(object, allowedKeys) // => { name: 'David' }
//
///////////////////////////////////////////////////////////////////////////

export const stripObj = <T extends object>(
  obj: T,
  allowedKeys: string[] = []
): Partial<T> => {
  const newObject = { ...obj } // shallow copy
  const keys = Object.keys(newObject)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!allowedKeys.includes(key)) {
      delete newObject[key as keyof typeof newObject]
    }
  }

  return newObject
}

/* ======================
      formatDate()
====================== */
// By default, I've set this to timeZone: 'UTC'.
// This means that if we're expecting a UTC date
// that it will output correctly against the users own time.

export const formatDate = (
  date: Date,
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric', // "numeric" | "2-digit" | undefined
    month: 'long', //  "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined'
    day: 'numeric', // 'numeric' | '2-digit' | undeined
    weekday: 'long', // "long" | "short" | "narrow" | undefined'
    hour: 'numeric', // "numeric" | "2-digit" | undefined
    minute: '2-digit', // '"numeric" | "2-digit" | undefined
    // second: '2-digit', // '"numeric" | "2-digit" | undefined
    // dayPeriod: 'long' // "long" | "short" | "narrow" | undefined
    timeZone: 'UTC'
    // Using timeZoneName makes it more confusing.
    // timeZoneName: 'short' // "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined
  }
) => {
  if (!(date instanceof Date) || isNaN(Date.parse(date.toISOString()))) {
    return
  }
  return date.toLocaleDateString('en-US', options)
}

/* ======================
   stripObjOfUndefined
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   const myObject: Record<string, any> = {
//     name: 'David',
//     age: 46,
//     weight: undefined
//     height: undefined
//   }
//
//   const strippedObject = stripObjOfUndefined(myObject);
//
//   console.log({
//     strippedObject,                      // { name: 'David', age: 46 }
//     isEqual: strippedObject === myObject // true
//   })
//
///////////////////////////////////////////////////////////////////////////

// Here, we're using a Generic which is slightly more flexible than Record<string, any>,
// but both work essentially the same.
export const stripObjOfUndefined = <T extends object>(obj?: T) => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const copy = { ...obj }

  for (const key in copy) {
    if (copy[key] === undefined) {
      delete copy[key]
    }
  }
  return copy
}

/* ======================
  handleServerError()
====================== */
// Log error to Sentry...

export const handleServerError = (res: Response, err: unknown) => {
  const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
  let message = 'Server error.'

  if (isDevelopment) {
    if (err instanceof Error) {
      message = err.message
      console.log({ name: err.name, message: message, stack: err.stack })
    } else {
      console.log(err)
    }
  }

  const ResponseBody: ResBody<null> = {
    data: null,
    message: message,
    success: false,
    code: 'INTERNAL_SERVER_ERROR'
  }

  return res.status(500).json(ResponseBody)
}

// From react-toastify
// export const isNum = (v: any): v is Number =>typeof v === 'number' && !isNaN(v);
// export const isStr = (v: any): v is String => typeof v === 'string';
// export const isFn = (v: any): v is Function => typeof v === 'function';
