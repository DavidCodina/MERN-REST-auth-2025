import mongoose from 'mongoose'
import { codes } from 'utils'

export type Code = (typeof codes)[keyof typeof codes]

// This is used in each of the controllers to create a custom ResBody. For example:
// export const createOrder = async (req: Request, res: Response<ResBody<OrderType | null>>) => { ... }
export type ResBody<DataType> = {
  code: Code
  data: DataType
  errors?: Record<string, string> | null
  message: string
  success: boolean
  // Adding this makes the type more flexible, while still being informative. That
  // said, if you need additional properties, it's MUCH safer to write a custom type.
  // [key: string]: any
}

export type Role = 'USER' | 'ADMIN'

export type Session = {
  id: string
  role: Role
  sessionExp: number
  sessionIat: number
}

/** The payload of the decoded refreshToken. */
export type RefreshTokenData = {
  jti: string
  id: string
  role: Role
  exp: number
  iat: number
}

/** The payload of the decoded accessToken. */
export type AccessTokenData = {
  id: string
  role: Role
  exp: number
  iat: number
}

type BlacklistObject = {
  jti: string
  expiresAt: Date
}

export type User = {
  _id: mongoose.Types.ObjectId
  userName: string
  firstName: string
  lastName: string
  email: string
  image?: string
  password: string
  refreshTokenBlacklist: BlacklistObject[]
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Todo = {
  _id: mongoose.Types.ObjectId
  title: string
  body: string
  completed: boolean
  // Previously, I was doing this:  mongoose.Types.ObjectId | User
  // However, it's generally easier to leave it as mongoose.Types.ObjectId.
  // Then if you decide to populate the user in a specific case, you can also
  // Typecast the result.
  user: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
