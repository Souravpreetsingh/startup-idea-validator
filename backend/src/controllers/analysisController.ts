import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { analyzeStartupIdea } from '../services/aiAnalysisService'
import { checkAndAwardBadges } from '../services/badgeService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import logger from '../config/logger'
import type { AuthRequest } from '../types'

export const generateAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  logger.info('[Analysis] Request received', { body: req.body, userId: req.userId })

  const { ideaId } = req.body

  logger.info('[Analysis] Fetching startup idea', { ideaId })
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) {
    logger.warn('[Analysis] Idea not found', { ideaId })
    throw new NotFoundError('Startup idea')
  }
  logger.info('[Analysis] Idea found', { title: idea.title, userId: idea.userId })

  if (idea.userId.toString() !== req.userId) {
    logger.warn('[Analysis] Authorization failed', { ideaUserId: idea.userId, requestUserId: req.userId })
    throw new ForbiddenError('Not authorized to analyze this idea')
  }

  const existing = await AnalysisResult.findOne({ ideaId })
  if (existing) {
    logger.info('[Analysis] Returning cached analysis', { ideaId, analysisId: existing._id })
    sendSuccess(res, { analysis: existing.toJSON() }, 'Using cached analysis')
    return
  }

  logger.info('[Analysis] Generating new analysis', { title: idea.title, industry: idea.industry })

  let analysis
  try {
    analysis = await analyzeStartupIdea(idea)
    logger.info('[Analysis] AI analysis succeeded', {
      score: analysis.ideaScore,
      probability: analysis.successProbability,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logger.error('[Analysis] AI analysis failed', { error: message, ideaId })
    res.status(500).json({
      success: false,
      message: 'AI generation failed',
      error: message,
    })
    return
  }

  logger.info('[Analysis] Saving analysis to database', { ideaId })
  const saved = await AnalysisResult.create({
    ideaId,
    userId: req.userId,
    ideaScore: analysis.ideaScore,
    marketDemand: analysis.marketDemand,
    competition: analysis.competition,
    competitors: analysis.competitors,
    swot: analysis.swot,
    revenueSuggestions: analysis.revenueSuggestions,
    growthStrategy: analysis.growthStrategy,
    mvpRoadmap: analysis.mvpRoadmap,
    successProbability: analysis.successProbability,
  })

  logger.info('[Analysis] Analysis saved successfully', { analysisId: saved._id, ideaId })

  checkAndAwardBadges(req.userId!).catch((err) => {
    logger.warn('[Analysis] Badge check failed', { error: err })
  })

  sendSuccess(res, { analysis: saved.toJSON() }, 'Analysis generated')
})

export const getAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await AnalysisResult.findOne({ ideaId: req.params.ideaId })
  if (!result) {
    throw new NotFoundError('Analysis result')
  }

  if (result.userId.toString() !== req.userId) {
    throw new ForbiddenError('Not authorized to view this analysis')
  }

  sendSuccess(res, { analysis: result.toJSON() })
})

export const getAllAnalyses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  const [results, total] = await Promise.all([
    AnalysisResult.find({ userId: req.userId })
      .populate('ideaId', 'title industry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AnalysisResult.countDocuments({ userId: req.userId }),
  ])

  sendSuccess(res, {
    analyses: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})
