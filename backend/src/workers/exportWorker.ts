import { Worker, type ConnectionOptions } from 'bullmq'
import Redis from 'ioredis'
import PDFDocument from 'pdfkit'
import { AnalysisResult } from '../models/AnalysisResult'
import { StartupIdea } from '../models/StartupIdea'
import logger from '../config/logger'

const REDIS_URL = process.env.REDIS_URL || ''

export function createExportWorker() {
  if (!REDIS_URL) return

  const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null }) as any

  const worker = new Worker<{ ideaId: string; userId: string }>(
    'export',
    async (job) => {
      logger.info(`[Worker] Generating PDF export for idea ${job.data.ideaId}`)

      const analysis = await AnalysisResult.findOne({ ideaId: job.data.ideaId }).lean()
      const idea = await StartupIdea.findById(job.data.ideaId).lean()

      if (!analysis || !idea) throw new Error('Analysis or idea not found')

      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))

      doc.fontSize(24).text(idea.title, { align: 'center' })
      doc.moveDown()
      doc.fontSize(14).text(`Industry: ${idea.industry}`)
      doc.moveDown()
      doc.fontSize(12).text(`Idea Score: ${analysis.ideaScore}/100`)
      doc.text(`Success Probability: ${analysis.successProbability}%`)
      doc.moveDown()
      doc.fontSize(14).text('SWOT Analysis')
      doc.fontSize(11).text(`Strengths: ${analysis.swot.strengths.join(', ')}`)
      doc.text(`Weaknesses: ${analysis.swot.weaknesses.join(', ')}`)
      doc.text(`Opportunities: ${analysis.swot.opportunities.join(', ')}`)
      doc.text(`Threats: ${analysis.swot.threats.join(', ')}`)
      doc.end()

      return new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))
      })
    },
    { connection: connection as ConnectionOptions, concurrency: 2 }
  )

  worker.on('completed', (job) => {
    logger.info(`[Worker] Export ${job.id} completed for idea ${job.data.ideaId}`)
  })

  worker.on('failed', (job, err) => {
    logger.error(`[Worker] Export ${job?.id} failed: ${err.message}`)
  })

  return worker
}
