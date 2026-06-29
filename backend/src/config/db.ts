import mongoose from 'mongoose'
import { env } from './env'
import logger from './logger'

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGO_URI)
    logger.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
