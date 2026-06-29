import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { analyzeCompetitors, getCompetitorInsight } from '../services/competitorService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const analyze = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string

  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const competitors = await analyzeCompetitors(idea)
  const insight = await getCompetitorInsight(ideaId)

  sendSuccess(res, { competitors, marketPosition: insight?.marketPosition || '' }, 'Competitor analysis complete')
})

export const getInsight = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const insight = await getCompetitorInsight(ideaId)
  if (!insight) throw new NotFoundError('Competitor insight')
  if (insight.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  sendSuccess(res, { competitors: insight.competitors, marketPosition: insight.marketPosition })
})
