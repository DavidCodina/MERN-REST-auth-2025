import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {})

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err: any) {
    console.log(
      'Something went wrong with the mongoose connection (db.ts).',
      err
    )

    process.exit(1)
  }
}
