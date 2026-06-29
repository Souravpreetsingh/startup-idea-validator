import { Router, Response } from 'express'
import { authenticate } from '../middleware/auth'
import { AnalysisResult } from '../models/AnalysisResult'
import { StartupIdea } from '../models/StartupIdea'
import { generateAnalysisPDF } from '../services/exportService'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

const router = Router()

router.get(
  '/analysis/:ideaId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ideaId } = req.params

    const analysis = await AnalysisResult.findOne({ ideaId })
    if (!analysis) throw new NotFoundError('Analysis')

    const idea = await StartupIdea.findById(ideaId)
    if (!idea) throw new NotFoundError('Startup idea')

    if (analysis.userId.toString() !== req.userId || idea.userId.toString() !== req.userId) {
      throw new ForbiddenError('Not authorized')
    }

    const pdf = await generateAnalysisPDF(analysis, idea)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${ideaId}.pdf"`)
    res.send(pdf)
  })
)

export default router
