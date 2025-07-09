import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import User from 'models/userModel'
import {
  codes,
  handleServerError,
  isRefreshTokenData,
  accessTokenExpiration,
  refreshTokenExpiration,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions
} from 'utils'
import { LoginUserSchema } from './LoginUserSchema'
import { ResBody, Session } from 'types'

/* ======================
        logIn()
====================== */
// https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=8
// Video 8 at 4:30 creates a rate-limiter for the login route.
// This is done with: npm i express-rate-limit.

export const logIn = async (
  req: Request,
  res: Response<ResBody<Session | null>>
) => {
  const { email, password } = req.body

  /* ======================
          Validation
  ====================== */

  const validationResult = LoginUserSchema.safeParse({
    email,
    password
  })

  if (!validationResult.success) {
    return res.status(400).json({
      code: codes.INVALID_CREDENTIALS,
      data: null,
      message: 'Invalid credentials. (1)', // Technically "email not found", but be opaque.
      success: false
    })
  }

  try {
    /* ======================
          Existence Check
    ====================== */
    // The exec() function is used in Mongoose to execute a query. However, when you’re using
    // await with Mongoose queries, you don’t necessarily need to use exec(). The await keyword
    // will automatically resolve the promise returned by findOne().
    // Dont' call .lean() because we will be using .save() on existingUser.

    const existingUser = await User.findOne({ email }).exec()

    if (!existingUser) {
      return res.status(400).json({
        code: codes.INVALID_CREDENTIALS,
        data: null,
        message: 'Invalid credentials. (2)', // Technically "email not found", but be opaque.
        success: false
      })
    }

    /* ======================
        isDeactivated Check
    ====================== */

    const isDeactivated = existingUser.isActive === false

    if (isDeactivated) {
      return res.status(409).json({
        data: null,
        code: codes.INVALID_CREDENTIALS, // 'USER_ARCHIVED' -  too much info.
        message: 'Invalid credentials. (3)',
        success: false
      })
    }

    /* ======================
          Match Check
    ====================== */
    // Compare plain text password that was sent in req.body to the hashed
    // password in the database (that corresponds to the associated email).
    // Validate password with bcrypt (bcryptjs actually).

    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
      return res.status(400).json({
        code: codes.INVALID_CREDENTIALS,
        data: null,
        message: 'Invalid credentials. (4)', // Technically "bad password", but be opaque.
        success: false
      })
    }

    /* ======================
        Create refreshToken
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // Generate a unique JWT ID for the refresh token. uuidv4() is the industry standard
    // for generating unique, random identifiers for things like JWT IDs, session tokens, and more.
    // It's used by major companies and open-source projects everywhere for exactly this kind of use case.
    //
    // What's the probability of a collision? UUIDv4 generates a 128-bit value, with 122 bits of randomness.
    // That's 2^122 possible values. The probability of a collision is so astronomically low that, for all
    // practical purposes, it's zero —even at internet scale.
    //
    ///////////////////////////////////////////////////////////////////////////

    const jti = uuidv4()

    const refreshToken = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
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
        id: existingUser._id,
        role: existingUser.role
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: accessTokenExpiration }
    )

    await existingUser.save()

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
      id: existingUser._id.toString(),
      role: existingUser.role,
      sessionExp: decodedRefreshToken.exp,
      sessionIat: decodedRefreshToken.iat
    }

    return res.status(200).json({
      code: codes.OK,
      data: session,
      message: 'Login success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
