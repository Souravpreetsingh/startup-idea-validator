import { Worker, type ConnectionOptions } from 'bullmq'
import Redis from 'ioredis'
import logger from '../config/logger'

const REDIS_URL = process.env.REDIS_URL || ''

export function createEmailWorker() {
  if (!REDIS_URL) return

  const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null }) as any

  const worker = new Worker<{ to: string; subject: string; html: string; type: string }>(
    'email',
    async (job) => {
      logger.info(`[Worker] Sending email: ${job.data.type} to ${job.data.to}`)

      if (!process.env.SMTP_HOST) {
        logger.info(`[Worker] (dry-run) Email to ${job.data.to}: ${job.data.subject}`)
        return { sent: false, dryRun: true }
      }

      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Validator Pro" <noreply@validatorpro.app>',
        to: job.data.to,
        subject: job.data.subject,
        html: job.data.html,
      })

      return { sent: true }
    },
    { connection: connection as ConnectionOptions, concurrency: 5 }
  )

  worker.on('completed', (job) => {
    logger.info(`[Worker] Email ${job.id} sent to ${job.data.to}`)
  })

  worker.on('failed', (job, err) => {
    logger.error(`[Worker] Email ${job?.id} failed: ${err.message}`)
  })

  return worker
}
