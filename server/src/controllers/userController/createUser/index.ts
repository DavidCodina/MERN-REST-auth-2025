import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import User from 'models/userModel'
import {
  codes,
  getZodErrors,
  handleServerError,
  isRefreshTokenData,
  accessTokenExpiration,
  refreshTokenExpiration,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions
} from 'utils'
import { getCreateUserSchema } from './getCreateUserSchema'
import { ResBody, Session } from 'types'

/* ========================================================================
                        createUser()  AKA Register user
======================================================================== */
////////////////////////////////////////////////////////////////////////////////
//
// It's very important to use the correct status codes as discussed here:
// https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
// 403 Forbidden should only be used in verifyRolesMiddleware().
// 403 might also be used if a user has authentication credentials, but
// is attempting to mutate a resource that does not belong to them.
//
// 401 Unauthorized is used in authMiddleware() and in authController's
// refreshAccessToken(). On the client, 401 (and only 401) is used to
// to refresh the accessToken from the axios interceptor.
// It does not check for 403, nor should it.
//
// Gotcha: Don't use .then() inside of a try / catch.
// In other words, don't mix .then() with async / await.
// It's possible that if you try to return a response in
// a .then() it will fire after the catch block fires, and
// this could cause an error.
//
////////////////////////////////////////////////////////////////////////////////

export const createUser = async (
  req: Request,
  res: Response<ResBody<Session | null>>
) => {
  const { userName, firstName, lastName, email, password, confirmPassword } =
    req.body

  try {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // In the the following video at 7:00, we update this to be case insensitive.
    // In other words, we want to prohibit dAvId@example.com if david@example.com already exists.
    // https://www.youtube.com/watch?v=jEVyPJ3U_y0&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=12
    // Here's the docs for the collation method: https://www.mongodb.com/docs/manual/reference/collation/
    //
    //   const existingUser = await User.findOne({ email })
    //     .collation({ locale: 'en', strength: 2 })
    //     .lean()
    //     .exec()
    //
    // The description for strength level 2 is very cryptic. However, among other things
    // it makes checks case insensitive.
    //
    // While that's a possible solution, I don't like not knowing what else it does.
    // I've found that this also works
    //
    //   const existingUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') })
    //     .lean()
    //     .exec()
    //
    ////////////////////////////////////////////////////////////////////////////////

    const existingUser = await User.findOne({
      email: new RegExp(`^${email}$`, 'i')
    })
      .lean()
      .exec()

    /* ======================
          Validation
    ====================== */

    const CreateUserSchema = getCreateUserSchema({
      existingUser,
      password
    })

    const validationResult = CreateUserSchema.safeParse({
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    })

    // Leverage the discriminated union.
    // Prior to this, validationResult.data is ?.
    if (!validationResult.success) {
      // At this point, we know that there are errors, and getZodErrors()
      // ALWAYS return an object. This pretty much guarantees that there
      // will be at least one property in formErrors - unless something
      // very unexpected happens in the getZodErrors() utility.
      const errors = getZodErrors(validationResult.error)

      return res.status(400).json({
        code: codes.FORM_ERRORS,
        data: null,
        errors: errors,
        message: 'The form data is invalid.',
        success: false
      })
    }

    // At this point data is assured.
    const validated = validationResult.data

    /* ======================
          Create User
    ====================== */
    // Best practice: use the validated/sanitized data when creating the user.
    // This takes a little bit of trust in Zod, but rest assured that the data
    // is on the validated object.

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      userName: validated.userName,
      firstName: validated.firstName,
      lastName: validated.lastName,
      // https://www.youtube.com/watch?v=htB2uJCf4ws at 13:15
      // "All emails are technically lowercase."
      // Also, doing this would then work with the unique constraint
      // in the Mongoose model even in the absence of the case-insensitive
      // email regex check done above.
      email: validated.email.toLowerCase(),
      password: hashedPassword
    })

    /* ======================
       Create refreshToken
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // jti: from JWT ID. A string representing a unique identifier for this JWT.
    // This claim may be used to differentiate JWTs with other similar content
    // (preventing replays, for instance). It is up to the implementation to guarantee uniqueness.
    //
    //   Excerpt From The JWT Handbook
    //   Sebastián E. Peyrott, Auth0 Inc.
    //
    // Generate a unique JWT ID for the refresh token. uuidv4() is the industry standard
    // for generating unique, random identifiers for things like JWT IDs, session tokens, and more.
    // It's used by major companies and open-source projects everywhere for exactly this kind of use case.
    //
    // What's the probability of a collision? UUIDv4 generates a 128-bit value, with 122 bits of randomness.
    // That's 2^122 possible values. The probability of a collision is so astronomically low that, for all
    // practical purposes, it's zero — even at internet scale.
    //
    ///////////////////////////////////////////////////////////////////////////

    const jti = uuidv4()

    const refreshToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        jti: jti
        // exp and iat get added by jwt.sign()
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: refreshTokenExpiration }
    )

    const decodedRefreshToken = jwt.decode(refreshToken)

    /* ======================
      RefreshTokenData Check
    ====================== */
    // In practice this 500 response should never happen. However,
    // it gives Typescript confidence that the jwt.JwtPayload is
    // specifically of type RefreshTokenData.

    if (!isRefreshTokenData(decodedRefreshToken)) {
      return res.status(500).json({
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'The process failed while creating tokens.',
        success: false
      })
    }

    /* ======================
        Create accessToken
    ====================== */

    const accessToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: accessTokenExpiration }
    )

    const savedUser = await newUser.save()

    /* ======================
           Set Cookies
    ====================== */

    const accessTokenCookieOptions = getAccessTokenCookieOptions()
    res.cookie('accessToken', accessToken, accessTokenCookieOptions)

    const refreshTokenCookieOptions = getRefreshTokenCookieOptions()
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    /* ======================
            Response
    ====================== */

    const session: Session = {
      id: savedUser._id.toString(),
      role: savedUser.role,
      sessionExp: decodedRefreshToken.exp,
      sessionIat: decodedRefreshToken.iat
    }

    return res.status(201).json({
      code: codes.CREATED,
      data: session,
      message: 'Registration successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
