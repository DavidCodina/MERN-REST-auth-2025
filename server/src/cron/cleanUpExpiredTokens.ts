import cron from 'node-cron'
import User from 'models/userModel'

/* =============================================================================
       
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// ⚠️ Avoid Race Condition that nukes newly added `BlacklistObject` 🤯:
//
// A user may be hitting '/api/auth/refresh-token' at the exact moment the cron
// job runs. We do not want cleanUpExpiredTokens() to inadvertently overwrite a
// newly added `BlacklistObject` that was added to the user.refreshTokenBlacklist at
// the exact moment the cron job runs. In other words, we want to avoid potential
// race conditions.
//
//   Document-level atomicity: When MongoDB processes the $pull operation on a specific user document,
//   it locks that document for the duration of the operation. This means if a user hits the
//   '/api/auth/refresh-token' endpoint at the same time, one operation will complete before
//   the other starts.
//
//   Selective removal: The $pull operator only removes array elements that match the specified condition
//   (expiresAt: { $lte: new Date() }). It doesn't wholesale replace the array - it surgically removes
//   only the expired tokens.
//
//   Non-destructive: If a new token gets added to the blacklist while your cleanup is running, your operation
//   won't remove it (assuming the new token isn't already expired), and it won't interfere with the addition.
//
// Race Condition Scenario Analysis:
//
// Let's say these operations happen simultaneously:
//
//   - Thread A: The cron job runs $pull to remove expired refreshTokens.
//   - Thread B: The end user hits refresh endpoint, which adds a new refreshToken to the blacklist
//               Technically, it adds a new `BlacklistObject` to the user.refreshTokenBlacklist.
//
// MongoDB's document-level locking ensures these operations are serialized. The outcome will be deterministic regardless of order:
//
//   - If Thread A runs first: Expired refreshTokens are removed, then the new refreshToken is added.
//   - If Thread B runs first: The newly blacklisted refreshToken is added, then expired refreshTokens
//     (not including the new one) are removed
//
//
////////////////////////////////////////////////////////////////////////////////

const cleanUpExpiredTokens = async (): Promise<void> => {
  try {
    const _result = await User.updateMany(
      {},
      {
        $pull: {
          refreshTokenBlacklist: {
            // When you use $lte: new Date(), Mongoose/MongoDB will compare the expiresAt field
            // (which is a Date) to the current date/time you provide. No conversion is needed.
            // MongoDB knows how to compare Date objects natively.
            expiresAt: { $lte: new Date() }
          }
        }
      }
    )

    // console.log(`Cleaned up expired tokens. Modified ${result.modifiedCount} users.`)
  } catch (err) {
    // Log it to Sentry (???).
    console.error('Error cleaning up expired tokens:', err)
  }
}

/* ======================
    cron.schedule()
====================== */
////////////////////////////////////////////////////////////////////////////////
//
// Schedule a cron job to remove expired documents from the resetrequest collection.
// This occurs every hour. In practice, it would be fine if we set it to once a day...
//
// Wes Bos at 19:45 https://www.youtube.com/watch?v=9dIHjegGeKo
// He installs node-cron: npm i node-cron
// He also used corntab.com, but that no longer seems active.
// I used this instead:
//   https://crontab.guru/every-1-hour    0 * * * *
//   https://crontab.guru/every-5-minutes */5 * * * *
//   https://crontab.guru/every-minute    * * * * *
//           ┌────────────── second (optional)
//           │ ┌──────────── minute
//           │ │ ┌────────── hour
//           │ │ │ ┌──────── day of month
//           │ │ │ │ ┌────── month
//           │ │ │ │ │ ┌──── day of week
//           │ │ │ │ │ │
//           │ │ │ │ │ │
//
////////////////////////////////////////////////////////////////////////////////

// This cron runs once every 15 minutes.
cron.schedule('*/15 * * * *', () => {
  // console.log('\nRunning cleanUpExpiredTokens()...\n')
  cleanUpExpiredTokens()
})
