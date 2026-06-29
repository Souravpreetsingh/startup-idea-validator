import { Worker, type ConnectionOptions } from 'bullmq'
import Redis from 'ioredis'
import { analyzeStartupIdea } from '../services/aiAnalysisService'
import { StartupIdea } from '../models/StartupIdea'
import logger from '../config/logger'

const REDIS_URL = process.env.REDIS_URL || ''

export function createAnalysisWorker() {
  if (!REDIS_URL) {
    logger.warn('[Worker] Redis not configured — analysis worker disabled')
    return
  }

  const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null }) as any

  const worker = new Worker<{ ideaId: string; userId: string }>(
    'analysis',
    async (job) => {
      const { ideaId } = job.data
      logger.info(`[Worker] Processing analysis for idea ${ideaId}`)

      const idea = await StartupIdea.findById(ideaId)
      if (!idea) throw new Error(`Idea ${ideaId} not found`)

      const result = await analyzeStartupIdea(idea)
      return { ideaId, score: result.ideaScore, status: 'completed' }
    },
    { connection: connection as ConnectionOptions, concurrency: 2 }
  )

  worker.on('completed', (job) => {
    logger.info(`[Worker] Analysis ${job.id} completed for idea ${job.data.ideaId}`)
  })

  worker.on('failed', (job, err) => {
    logger.error(`[Worker] Analysis ${job?.id} failed: ${err.message}`)
  })

  return worker
}
