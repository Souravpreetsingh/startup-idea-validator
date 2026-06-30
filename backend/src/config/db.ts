import mongoose from 'mongoose'
import { env } from './env'
import logger from './logger'

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    logger.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error('MongoDB connection error:', error)
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
