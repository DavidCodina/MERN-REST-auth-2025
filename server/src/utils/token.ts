import { CookieOptions } from 'express'
import { RefreshTokenData, AccessTokenData } from 'types'

/* ======================
        constants
====================== */
// '1d', '1h', '1m', '30s', etc.

export const accessTokenExpiration = '1m' // ⚠️ Change to 5-15 minutes for production
export const refreshTokenExpiration = '3m' //`'1d'

/* ======================

====================== */

export const isRefreshTokenData = (
  value: unknown
): value is RefreshTokenData => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const result =
    typeof value === 'object' &&
    'jti' in value &&
    typeof value.jti === 'string' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'role' in value &&
    typeof value.role === 'string' &&
    'exp' in value &&
    typeof value.exp === 'number' &&
    'iat' in value &&
    typeof value.iat === 'number'

  return result
}

/* ======================

====================== */

export const isAccessTokenData = (value: unknown): value is AccessTokenData => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const result =
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'role' in value &&
    typeof value.role === 'string' &&
    'exp' in value &&
    typeof value.exp === 'number' &&
    'iat' in value &&
    typeof value.iat === 'number'

  return result
}

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha 1: The cookie was being blocked by Chrome, but not Safari.
// Some AI responses said that Chrome blocks cookies unless you use SameSite: 'none', Secure: true, and serve your app over HTTPS—even on localhost.
// However, the actual solution seemed to be as simple as going to the Sandbox settings --< Connection Settings --> Click Toggle to enable cookies.
//
// ⚠️ Gotcha 2: in the primary index.ts we do this immediately after all the imports:
//
//   dotenv.config()
//
// However, When you run your index.ts, all imports at the top are loaded and executed before any of your own code runs,
// including the dotenv.config() call. If any of those modules (like your cookieOptions or resolvers) reference process.env.NODE_ENV
// at the top level (i.e., outside a function), they will do so before your dotenv.config() runs in index.ts.
// Consequently, this won't work as expected.
//
//   export const cookieOptions: CookieOptions  = { ... }
//
// Instead, you need to make it a function that dynamically returns CookieOptions.
//
///////////////////////////////////////////////////////////////////////////

//^ express deprecated res.clearCookie: Passing "options.maxAge" is deprecated. In v5.0.0 of Express,
//^ this option will be ignored, as res.clearCookie will automatically set cookies to expire immediately.
//^ Please update your code to omit this option. dist/index.js:43038:47

// Do the cookie options need to match exactly?
// Yes, but with a caveat:
// The options that define the scope of the cookie—like path, domain, secure, and sameSite—must match between res.cookie and res.clearCookie (or res.cookie with an expired date).
// The value and expiration (maxAge or expires) do not need to match. In fact, you want them to be different when clearing the cookie!

export const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true, // Accessible only by the web server.
    maxAge: 1 * 60 * 1000, // 2 minutes - ⚠️ This should match accessTokenExpiration

    // domain?: string | undefined;
    // domain: 'http://localhost',
    // https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=8
    // Dave Gray uses sameSite:'None' in the tutorial at 19:00, but this seems to break the implementation for me.
    // This should allow cross-site cookies.
    // sameSite: 'None'
    // The tutorial does this, but I don't seem to need it.
    // This should limit to only https.
    // You would want this in production, but it may cause issues during development.
    // This is alluded to briefly in the following Dave Gray tutorial at 31:10
    // https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=11

    secure: process.env.NODE_ENV === 'development' ? false : true,

    // Make sure cookies are set with Secure, SameSite=Strict (or at least Lax), and httpOnly in production.
    //# I'm not sure if 'none' is what we want for production.
    //# You also need to consider whether the API is public or private.
    //# Consider this carefully. Generally sameSite: true is probably the
    //# safest. Otherwise, there may be a stronger possibility of CSRF attacks.
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
  }
}

/* ======================

====================== */
//

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // ⚠️ This should match refreshTokenExpiration
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    // Allow cookie to be sent to 'api/auth/refresh-token' AND 'api/auth/logout'.
    // The latter is necessary in order to blacklist the refreshToken.
    path: '/api/auth'
  }
}
