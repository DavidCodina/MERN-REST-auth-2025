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
