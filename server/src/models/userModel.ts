import { Schema, model, CallbackError } from 'mongoose'
import Todo from './todoModel'
import { User } from 'types'

const userSchema = new Schema<User>(
  {
    userName: {
      type: String,
      required: true // [true, "userName is required"]
    },

    firstName: { type: String, required: true },

    lastName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      // unique  doesn't catch case insensitivity, so david@example.com
      // and David@example.com are considered different by mongoose.
      unique: true
      // lowercase: true,
      // trim: true
    },

    image: { type: String, required: false },

    password: {
      type: String,
      required: true,
      select: false
      // minlength: 5
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      select: false
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // Storing a jti is more efficient than storing the whole JWT string.
    // https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist
    //
    // Possible Improvements:
    //
    //   - Consider moving the blacklist to a separate collection or to Redis for better scalability if you expect a ton of tokens or users.
    //   - Add an index on refreshTokenBlacklist.expiresAt for efficient cleanup.
    //   - If you want to support multiple device sessions, you could also store device info or session IDs.
    //
    /////////////////////////
    //
    // The embedded approach works fine for small to medium user bases.
    //
    // We could move to refreshTokenBlacklist to a separate collection.
    // However, this is only needed for 100K+ users with multiple
    // concurrent sessions. One of the major benefits of creating a separate
    // collection for refreshTokenBlacklist is that we can apply a TTL index
    // to remove expired refreshTokens, rather than using a cron job.
    //
    // So, if you want to leverage TTL for your refresh token blacklist, you’d
    // need to store each blacklist object as its own document in a separate
    // collection (e.g., refreshTokenBlacklist), rather than as an array inside
    // the User document.
    //
    //   // models/blacklistedTokenModel.ts
    //   const blacklistedTokenSchema = new Schema({
    //     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    //     jti: { type: String, required: true, unique: true },
    //     expiresAt: { type: Date, required: true },
    //     createdAt: { type: Date, default: Date.now }
    //   }, { timestamps: true })
    //
    //   // Add indexes for performance
    //   blacklistedTokenSchema.index({ userId: 1, expiresAt: 1 })
    //   blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index
    //   blacklistedTokenSchema.index({ jti: 1 }, { unique: true })
    //
    ///////////////////////////////////////////////////////////////////////////

    refreshTokenBlacklist: {
      type: [
        {
          jti: { type: String, required: true },
          expiresAt: { type: Date, required: true }
        }
      ],
      default: [],
      select: false
    },

    isActive: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
)

///////////////////////////////////////////////////////////////////////////
//
// For document-level deleteOne()
//
//   const user = await User.findById(userId)
//   await user.deleteOne()
//
///////////////////////////////////////////////////////////////////////////

userSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      // console.log('\nDeleting associated todos because user.deleteOne() was triggered.')
      await Todo.deleteMany({ user: this._id })
      next()
    } catch (err) {
      next(err as CallbackError)
    }
  }
)

///////////////////////////////////////////////////////////////////////////
//
// For query-level deleteOne() and deleteMany()
//
//   Query-level deleteOne() :
//
//     await User.deleteOne({ _id: userId }) // Triggers: { document: false, query: true }
//     await User.deleteOne({ email: 'user@example.com' })
//
//   Query-level deleteMany() :
//
//     await User.deleteMany({ role: 'USER' }) // Triggers: { document: false, query: true }
//     await User.deleteMany({ createdAt: { $lt: someDate } })
//
///////////////////////////////////////////////////////////////////////////

userSchema.pre(
  ['deleteOne', 'deleteMany'],
  { document: false, query: true },
  async function (next) {
    try {
      const docs = await this.model.find(this.getQuery())
      const userIds = docs.map((doc) => doc._id)
      await Todo.deleteMany({ user: { $in: userIds } })
      next()
    } catch (err) {
      next(err as CallbackError)
    }
  }
)

///////////////////////////////////////////////////////////////////////////
//
// For findOneAndDelete()
//
//   await User.findOneAndDelete({ _id: userId })
//   await User.findOneAndDelete({ email: 'user@example.com' })
//
///////////////////////////////////////////////////////////////////////////

userSchema.pre('findOneAndDelete', async function (next) {
  try {
    const doc = await this.model.findOne(this.getQuery())
    if (doc) {
      await Todo.deleteMany({ user: doc._id })
    }
    next()
  } catch (err) {
    next(err as CallbackError)
  }
})

const User = model('User', userSchema)
export default User
