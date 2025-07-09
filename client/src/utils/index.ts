export * from './cn'
export * from './createMiniRouter'
export * from './formatCurrency'
export * from './lazyWithPreload'
export * from './log'
export * from './randomFail'
export * from './searchParamsToObject'
export * from './truthyArray'

export * from './isPromise'
export * from './isStringDict'
export * from './isResponseObject'
export * from './CustomError'
export * from './zod'
export * from './queueMacroTask'
export * from './codes'
export * from './handleError'
export * from './customFetch'
export * from './authEvents'

/* ======================
      isFileArray()
====================== */

export const isFileArray = (value: any): value is File[] => {
  return Array.isArray(value) && value.every((item) => item instanceof File)
}

/* ======================
  disableSmoothScroll()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
// <button
//   onClick={() => {
//     disableSmoothScroll()
//     router.push('/events')
//   }}
// >
//   Go To Events Page
// </button>
//
///////////////////////////////////////////////////////////////////////////

export const disableSmoothScroll = (duration = 1000) => {
  const html = document.querySelector('html')!
  html.style.scrollBehavior = 'auto'
  // No need to force reflow.
  // console.log(document.body.offsetHeight)
  setTimeout(() => {
    html.style.scrollBehavior = ''
  }, duration)
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
// Used in the catch(err) block of a try/catch.
// The Basir Udemy tutorial video 16 at 8:45 has a similar function...
// https://gale.udemy.com/course/nextjs-ecommerce/learn/lecture/32434498#overview

export const getErrorMessage = (
  err: any,
  fallBackMessage = 'The request failed!'
) => {
  return err?.response?.data?.message
    ? err?.response?.data?.message
    : err.message
      ? err.message
      : fallBackMessage
}

/* ======================
        sleep()
====================== */
// Used to in API calls to test/simulate a slow call
// Example: await sleep(4000)
export const sleep = (delay = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/* ======================
   imageFileToDataURL()
====================== */

export const imageFileToDataURL = (
  file: any,
  callback: (dataURL: string) => void
) => {
  const reader = new FileReader()
  reader.onloadend = () => {
    const dataURL = reader.result as string
    callback?.(dataURL)
  }

  reader.readAsDataURL(file)
}

/* ======================
imageFileToBase64String()
====================== */

export const imageFileToBase64String = (
  file: any,
  callback: (base64String: string) => void
) => {
  const reader = new FileReader()

  reader.onloadend = () => {
    // The reader result is a dataURL, while the base64String is the stripped version.
    const dataURL = reader.result as string
    const base64String = dataURL.replace('data:', '').replace(/^.+,/, '')
    callback?.(base64String)
  }

  reader.readAsDataURL(file)
}

/* ======================
    transformToSlug()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// This function transforms a string (blog title, product name, etc)
// into a slug that can be used as a URL fragment.
//
// It will remove special characters from str, replace spaces with '-', and make lowercase.
// As far as special characters are concerned, rather than specifying what to exclude,
// it's easier to merely specify what is allowed.
// https://bobbyhadz.com/blog/javascript-remove-special-characters-from-string#:~:text=Use%20the%20replace()%20method,t%20contain%20any%20special%20characters.
//
///////////////////////////////////////////////////////////////////////////

// export const transformToSlug = (str: string) => {
//   if (!str || typeof str !== 'string') {
//     return str
//   }

//   ///////////////////////////////////////////////////////////////////////////
//   //
//   // Using "lib": ["ES2020", "DOM", "DOM.Iterable"] in tsconfig.json
//   // causes Typescript to warn you that .replaceAll() doesn't exist.
//   // I should probably use a different method anyways.
//   //
//   ///////////////////////////////////////////////////////////////////////////
//   const transformed = str
//     .replaceAll(/[^a-zA-Z0-9 ]/g, '')
//     .replaceAll(' ', '-')
//     .toLowerCase()

//   return transformed
// }

/* ======================
        getKB()
====================== */
// https://dev.to/rajnishkatharotiya/get-byte-size-of-the-string-in-javascript-20jm
// Blob is not defined. Presumably, you can't use Blob on the server.
// Thus if you want to test the size of the data returned by getServerSideProps, etc.,
// you would use it on the client side instead.
// The obj argument can technically be anything that can be stringified.

export const getKB = (obj: any) => {
  const bytes = new Blob([JSON.stringify(obj)]).size
  const kilobytes = Math.round(bytes / 1000)
  return kilobytes
}

/* ======================
      propInObj()
====================== */
// https://dmitripavlutin.com/check-if-object-has-property-javascript/
export const propInObj = (prop: string, obj: Record<any, any>) => {
  return prop in obj
}

/* ======================
     isPlainObject()
====================== */
// Not tested...

export const isPlainObject = (x: any): boolean => {
  return (
    x !== null &&
    typeof x === 'object' &&
    /* a check for empty prototype would be more typical, but that
       doesn't play well with objects created in different vm contexts */
    (!x.constructor || x.constructor.name === 'Object') &&
    (x.toString ? x.toString() : Object.prototype.toString.call(x)) ===
      '[object Object]' &&
    /* check for reasonable markers that the object isn't an element for react & preact/compat */
    !('props' in x && (x.$$typeof || x.constructor === undefined))
  )
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

    if (typeof key === 'string' && !allowedKeys.includes(key)) {
      delete newObject[key as keyof typeof newObject]
    }
  }

  return newObject
}

/* ======================
  dateToUTCShortISO()
====================== */
// This function takes a Date object (like the one generated from React DatePicker)
// and converts it to a short UTC ISO (i.e., YYYY-MM-DD), like the kind output
// by <input type='date' />

export const dateToUTCShortISO = (date: Date) => {
  // Even if the date is an instance of Date, it might still be an 'Invalid Date'
  if (!(date instanceof Date) || isNaN(Date.parse(date.toISOString()))) {
    return
  }

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const UTC_Date = new Date(Date.UTC(year, month, day))
  const UTC_ISO = UTC_Date.toISOString()
  const UTC_SHORT_ISO = UTC_ISO.substring(0, 10)
  return UTC_SHORT_ISO
}

/* ======================
      formatDate()
====================== */
// By default, I've set this to timeZone: 'UTC'.
// This means that if we're expecting a UTC date
// that it will output correctly against the users own time.
//
// See shadcdn for a similar formatDate that take in string | number as an arg.
// https://github.com/shadcn-ui/ui/blob/main/apps/www/lib/utils.ts

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
      decodeJWT()
====================== */
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
// One could also use the jwt-decode NPM package as was done in the tutorial
// https://www.youtube.com/watch?v=UhrmPH3TLus&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=11 at 0:45
//
// Note: this is more of a client-side utility.
// If you're already on the server, then you can use jwt.decode() from the jsonwebtoken package.
// Also, you should be very careful when using decode functions like this that aren't
// actually validating the token. Ask yourself why you're using it and is it safe.

export function decodeJWT(token: string) {
  if (!token) {
    return null
  }

  try {
    // If there is no token (null, '', etc.), then this will error out.
    // Rather than coding defensively to avoid errors, it's
    // easier to just return null if an error occurs. Thus DO NOT use
    // conditional chaining...
    const base64Url = token.split('.')[1] as string

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    const decoded = JSON.parse(jsonPayload)
    return decoded
  } catch (_err) {
    return null
  }
}

/* ======================
      isFunction()
====================== */

export const isFunction = (value: any) => {
  return typeof value === 'function'
}

// From react-toastify
// export const isNum = (v: any): v is Number =>typeof v === 'number' && !isNaN(v);
// export const isStr = (v: any): v is String => typeof v === 'string';
// export const isFn = (v: any): v is Function => typeof v === 'function';

/* ======================
        clamp()
====================== */
// From Sam Selikoff's Framer Motion Recipes, video 4 at 2:10.
// But this is also a common utility: https://webtips.dev/webtips/javascript/how-to-clamp-numbers-in-javascript
// The return value will be the number if it's within range (inclusive),
// or the min or max (whichever is closest). The use of the word clamp is
// similar to the CSS clamp() function.
//
// Usage examples:
//
//   const v1 = clamp(10, 5, 15); // => 10
//   const v2 = clamp(4, 5, 15);  // =>  5
//   const v3 = clamp(20, 5, 15); // => 15

export const clamp = (number: number, min: number, max: number) => {
  return Math.min(Math.max(number, min), max)
}
