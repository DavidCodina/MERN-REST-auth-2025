import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import User from 'models/userModel'
import {
  codes,
  handleServerError,
  accessTokenExpiration,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  isRefreshTokenData
} from 'utils'

import { ResBody } from 'types'

/* ========================================================================
                                refreshAccessToken()
======================================================================== */

export const refreshAccessToken = async (
  req: Request,
  res: Response<ResBody<null>>
) => {
  // https://stackoverflow.com/questions/40277314/prevent-getting-json-response-from-cache-in-express-js
  // https://stackoverflow.com/questions/66460628/how-to-disable-rest-api-caching
  // https://regbrain.com/article/cache-headers-express-js
  // res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')

  const cookies = req.cookies

  // This is expected when the user first mounts the client-side app and has not yet logged in.
  // This would also be the case if the user had logged in, but the refreshToken cookie already expired.
  if (!cookies.refreshToken) {
    return res.status(401).json({
      code: codes.BAD_REQUEST,
      data: null,
      message: 'A `refreshToken` must be sent with the request.',
      success: false
    })
  }

  const refreshToken = cookies.refreshToken

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: any, decodedRefreshToken: unknown) => {
        /* ======================
                Error Check
        ====================== */

        if (err) {
          return res.status(401).json({
            code: codes.UNAUTHORIZED,
            data: null,
            message: 'Invalid `refreshToken`.', // i.e., expired or tampered with.
            success: false
          })
        }

        /* ======================
          RefreshTokenData Check
        ====================== */
        // In practice this 401 response should never happen. However,
        // it gives Typescript confidence that the jwt.JwtPayload is
        // specifically of type RefreshTokenData.

        if (!isRefreshTokenData(decodedRefreshToken)) {
          return res.status(401).json({
            code: codes.UNAUTHORIZED,
            data: null,
            message: 'The `refreshToken` was not of type `RefreshTokenData`.',
            success: false
          })
        }

        /* ======================
               User Check
        ====================== */

        const userId = decodedRefreshToken.id

        const user = await User.findById(userId)

        if (!user) {
          return res.status(401).json({
            code: codes.UNAUTHORIZED,
            data: null,
            message: 'User not found.',
            success: false
          })
        }

        /* ======================
          Is Blacklisted Check
        ====================== */

        const jti = decodedRefreshToken.jti

        if (user.refreshTokenBlacklist.some((entry) => entry.jti === jti)) {
          return res.status(401).json({
            code: codes.UNAUTHORIZED,
            data: null,
            message: 'The `refreshToken` was previously blacklisted.',
            success: false
          })
        }

        /* ======================
        Create New refreshToken
        ====================== */
        ///////////////////////////////////////////////////////////////////////////
        //
        // Best Practice: issue a new refreshToken every time the old one is used
        // AND INVALIDATE THE OLD ONE (i.e., blacklist it).
        //
        // Creating a new refreshToken also limits the actual lifespan of the previous refreshToken when done
        // in conjunction with blacklisting. Without blacklisting, refreshToken rotation is pointless and
        // less secure!
        //
        // The window for an attacker to use a stolen refreshToken is as short as the time between refreshes.
        // Thus, if the legit user gets their current refreshToken stolen, then as soon as they request a
        // new accessToken (or logout), that refreshToken will be invalidated/blacklisted.
        // This means that any malicious attacker with the refreshToken now has an invalid refreshToken (maybe).
        // Ultimately, that depends on who wins the 'refresh race'.
        //
        // If the attacker makes a request to refresh the access token and then also gets a new refreshToken,
        // then they've now hijacked the session and have unlimited accessTokens AND unlimited refreshTokens.
        // That being the case, is it really better to issue a new refreshToken hear each time. In other words,
        // does refreshToken rotation make things more secure or less secure? Ultimately, the current wisdom
        // suggests that rotating is STILL better than not rotating.
        //
        //   - Without rotation, a stolen refreshToken is valid until it expires (could be days).
        //
        //   - With rotation, the attacker has to "race" the legit user, and the window is much smaller.
        //     Whoever uses refreshToken first wins the "race":
        //
        // Ultimate security: Combine rotation with device/session binding, anomaly detection, and absolute expiry.
        // Consider implementing additional security layers:
        //
        //   - Device fingerprinting: Bind tokens to device characteristics
        //   - IP address validation: Flag suspicious location changes
        //   - Rate limiting: Prevent brute force attacks on the refresh endpoint
        //   - Anomaly detection: Monitor for unusual access patterns
        //
        /////////////////////////
        //
        // Granting a new refreshToken  will inherently create a sliding session
        // (i.e., indefinite session extension), which we may or may not want.
        //
        // Pros:
        //   - Better UX: Users don't get logged out unexpectedly
        //   - Reduced Friction: No interruptions during long work sessions
        //
        // Cons:
        //   - Security Risk: Sessions can potentially last forever if user keeps refreshing
        //   - Attack Window: If a refresh token is stolen, the attacker has unlimited access
        //   - Compliance Issues: Some industries (finance, healthcare) require session timeouts
        //
        // If you don't want this then you must implement logic for an absolute session expiration.
        // Ultimately, this is more secure because it prevents malicious actors from creating
        // infinite sessions, but it really depends on the kind of app you're building.
        // (i. e., social media, banking, government, healthcare, etc.).
        //
        /////////////////////////
        //
        // Create absolute refreshToken expiration through a dynamic expiresIn:
        //
        // If for some reason now is greater than decodedRefreshToken.exp, you'll get a negative value.
        // Consequently, we don't want to just do this:
        //
        //   const remainingTime = decodedRefreshToken.exp - now
        //
        // The jwt.sign() library might handle this gracefully, but it's better to be explicit:
        //
        //   const remainingTime = Math.max(0, decodedRefreshToken.exp - now)
        //
        ///////////////////////////////////////////////////////////////////////////

        // Date.now() returns the current time in milliseconds since the Unix epoch (Jan 1, 1970).
        // JWT exp (expiration) is always in seconds since the Unix epoch, as per the JWT spec.
        const now = Math.floor(Date.now() / 1000)
        const remainingTime = Math.max(0, decodedRefreshToken.exp - now)

        const newRefreshToken = jwt.sign(
          {
            id: decodedRefreshToken.id,
            role: decodedRefreshToken.role
            // exp and iat get added by jwt.sign()
          },
          process.env.REFRESH_TOKEN_SECRET!,
          { expiresIn: remainingTime }
        )

        // const decodedNewRefreshToken = jwt.decode(
        //   newRefreshToken
        // ) as RefreshTokenData

        /* ======================
        Create New Access Token
        ====================== */

        const newAccessToken = jwt.sign(
          {
            id: decodedRefreshToken.id,
            role: decodedRefreshToken.role
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: accessTokenExpiration }
        )

        /* ======================
              Set Cookies
        ====================== */

        // The accessToken cookie won't actually have been sent from the client
        // to the server if it already expired. However, for the sake of argument,
        // if it was sent then this would effectively overwrite it. Why? Because
        // HTTP cookies are uniquely identified by their name, domain and path.
        const accessTokenCookieOptions = getAccessTokenCookieOptions()
        res.cookie('accessToken', newAccessToken, accessTokenCookieOptions)

        const refreshTokenCookieOptions = getRefreshTokenCookieOptions()
        res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)

        /* ======================
        Clean Up Expired Tokens (Optional) 
        ====================== */
        // This is more of a micro-optimization that keeps user.refreshTokenBlacklist tidy in real-time.
        // The real cleanup happens in a cron job. Is it redundant? Should we "double up or DRY up"?
        // This is operation is not strictly necessary, but it's nice to have. Similar logic also
        // exists in the logOut() controller.

        // Direct comparison works fine here - no need to * or / by 1000.
        // entry.expiresAt.getTime() returns the time in milliseconds since the Unix epoch.
        // Date.now() also returns the current time in milliseconds since the Unix epoch.

        user.refreshTokenBlacklist = user.refreshTokenBlacklist.filter(
          (entry) => entry.expiresAt.getTime() > Date.now()
        )

        /* ======================
        Blacklist Previous refreshToken
        ====================== */

        if (decodedRefreshToken.jti && decodedRefreshToken.exp) {
          user.refreshTokenBlacklist.push({
            jti: decodedRefreshToken.jti,
            // decodedRefreshToken.exp is the JWT expiration time, which is a UNIX timestamp in seconds.
            // JavaScript Date expects a timestamp in milliseconds since the Unix epoch.
            expiresAt: new Date(decodedRefreshToken.exp * 1000)
          })
        }

        await user.save()

        /* ======================
                Response
        ====================== */
        ///////////////////////////////////////////////////////////////////////////
        //
        // ⚠️ If '/api/auth/refresh-token' grants a new refreshToken when granting
        // a new accessToken then consider whether or not you're intentionally
        // creating indefinite refreshToken extensions.
        //
        // Unless mitigated by logic that implements an absolute session expiration,
        // granting a new refreshToken will inherently generate a sliding session
        // such that every successful request to '/api/auth/refresh-token' renews
        // the refreshToken, and therefore extends the session.
        //
        // In such cases, if using sessionExp or sessionIat on the client, it's crucial that
        // the client update it's session state. However, you definitely DO NOT
        // want to send back session data from '/api/auth/refresh-token' because
        // it's a public endpoint.
        //
        // Well... That last point is debatable. While the refresh endpoint is technically public,
        // it still requires a valid refreshToken cookie, which provides sufficient security for
        // returning session metadata. Thus, it might be acceptable to return session metadata.
        //
        // However, things get more nuanced when you start talking about returning sensitive user details.
        //
        //   - Purpose Alignment: The refresh endpoint exists to maintain
        //     session continuity. Session metadata directly supports this purpose, while detailed
        //     user information does not. When an endpoint starts serving multiple purposes,
        //     it becomes harder to secure and maintain.
        //
        //   - Attack Surface Considerations: Every piece of data you return creates potential attack vectors.
        //     If your refresh endpoint returned full user profiles, attackers who compromise refresh tokens
        //     would gain access to much more sensitive information. By limiting the response to session metadata,
        //     you minimize the damage potential.
        //
        //   - Audit and Compliance Implications: Many regulatory frameworks require organizations to track when
        //     and how sensitive data is accessed. If your refresh endpoint returned personal details, you'd need
        //     to log these as data access events, complicating your audit trail.
        //
        // Imagine an attacker who manages to steal a refresh token but doesn't have access to the user's other credentials.
        // If your refresh endpoint returned full user details, the attacker would immediately gain access to:
        //
        //   - Personal information that could be used for social engineering attacks
        //   - Profile details that might reveal security questions or password hints
        //   - Contact information that could be used for targeted phishing attempts
        //
        // By limiting the response to ONLY session metadata, you've created what security professionals call
        // "compartmentalization" - even if one security boundary is breached, the damage is contained.
        //
        // In my opinion, this is also why it's generally a good idea to keep session info as lean as possible.
        // The response back from a login or registration endpoint should just be basic session info.
        // It's not the job of these endpoints to return user data. In other words, user data and session
        // data should be kept separate. Do not violate the "principle of least privilege". To put it another
        // way, maintain a separation of concerns.
        //
        /////////////////////////
        //
        // Other Alternatives:
        //
        // Given a sliding session, the alternative to returning session metadata here is for the client
        // to make a subsequent request to '/api/auth/session' each time '/api/auth/refresh-token' responds
        // back successfully. Otherwise, the sessionExp and sessionIat would quickly become stale.
        //
        // That said, this app mitigates the issue entirely by using an absolute expiration
        // that dynamically sets the expiresIn of each renewed refreshToken. Not only does
        // this avoid all of the above complexity, but it's also more secure.
        //
        ///////////////////////////////////////////////////////////////////////////

        // const session: Session = {
        //   id: user._id.toString(),
        //   role: user.role,
        //   sessionExp: decodedNewRefreshToken?.exp,
        //   sessionIat: decodedNewRefreshToken?.iat
        // }

        return res.status(200).json({
          code: codes.OK,

          // Is it okay to return the session metadata here even though it's a public endpoint?
          // Arguably, yes because even though it's public it's still essentially authenticated
          // because of the steps that were necessary to reach ths point in the controller flow.
          // That said, there's currently no reason to return session metadata, so it's omitted for now.
          data: null,
          message: 'The request for a new `accessToken` was granted.',
          success: true
        })
      }
    )
  } catch (err) {
    return handleServerError(res, err)
  }
}
