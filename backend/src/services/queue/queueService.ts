import { Queue } from 'bullmq'
import Redis from 'ioredis'
import logger from '../../config/logger'

const REDIS_URL = process.env.REDIS_URL || ''

let connection: Redis | null = null

function getConnection() {
  if (!connection) {
    connection = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
    })
  }
  return connection
}

const baseJobOpts = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 2000 },
  removeOnComplete: { age: 86400 },
  removeOnFail: { age: 604800 },
}

function createQueue(name: string, opts: any = {}) {
  if (!REDIS_URL) return null as any
  return new Queue(name, {
    connection: getConnection() as any,
    defaultJobOptions: { ...baseJobOpts, ...opts },
  })
}

export const analysisQueue = createQueue('analysis')
export const emailQueue = createQueue('email', { removeOnFail: undefined })
export const exportQueue = createQueue('export', {
  attempts: 2,
  backoff: { type: 'fixed' as const, delay: 5000 },
  removeOnComplete: { age: 3600 },
})

export function initQueues() {
  if (!REDIS_URL) {
    logger.warn('[Queue] Redis not configured — queues disabled')
    return
  }
  logger.info('[Queue] BullMQ queues initialized')
}

export function isQueuesEnabled() {
  return !!REDIS_URL
}
