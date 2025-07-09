import { codes } from 'utils'

export type Code = (typeof codes)[keyof typeof codes]

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

export type ResponsePromise<T = unknown> = Promise<ResBody<T>>

export type Role = 'USER' | 'ADMIN'

export type Session = {
  id: string
  role: Role
  sessionExp: number
  sessionIat: number
}

export type User = {
  _id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  image?: string
  createdAt: string
  updatedAt: string
}

export type UnsafeUser = User & {
  role: Role
}

export type Todo = {
  _id: string
  title: string
  body: string
  completed: boolean
  user: User
  createdAt: string
  updatedAt: string
}
