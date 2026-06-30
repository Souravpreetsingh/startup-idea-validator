import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { sanitizeInput } from './middleware/security/sanitize'
import { apiLimiter, authLimiter } from './middleware/security/rateLimiter'
import { performanceMonitor } from './middleware/performance'
import { initCache } from './services/cache/cacheService'
import { initQueues } from './services/queue/queueService'
import routes from './routes'
import logger from './config/logger'

const app = express()

const startTime = Date.now()

initCache()
initQueues()

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(sanitizeInput)

app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter)

app.use(performanceMonitor)

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userId: (req as any).userId || 'anonymous',
  })
  next()
})

app.get('/api/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  const uptime = Math.floor((Date.now() - startTime) / 1000)

  res.json({
    success: true,
    status: dbState === 'connected' ? 'healthy' : 'degraded',
    database: dbState,
    aiService: 'local (no external API)',
    cache: process.env.REDIS_URL ? 'configured' : 'disabled',
    queue: process.env.REDIS_URL ? 'configured' : 'disabled',
    uptime: `${uptime}s`,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', routes)

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use(errorHandler)

export default app
