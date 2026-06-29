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

export const analysisQueue = new Queue('analysis', {
  connection: REDIS_URL ? (getConnection() as any) : (undefined as any),
  defaultJobOptions: baseJobOpts,
})

export const emailQueue = new Queue('email', {
  connection: REDIS_URL ? (getConnection() as any) : (undefined as any),
  defaultJobOptions: { ...baseJobOpts, removeOnFail: undefined },
})

export const exportQueue = new Queue('export', {
  connection: REDIS_URL ? (getConnection() as any) : (undefined as any),
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed' as const, delay: 5000 },
    removeOnComplete: { age: 3600 },
  },
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
