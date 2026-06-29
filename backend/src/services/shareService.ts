import { AnalysisResult } from '../models/AnalysisResult'
import { StartupIdea } from '../models/StartupIdea'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import logger from '../config/logger'

const shareTokens = new Map<string, { analysisId: string; userId: string; createdAt: Date }>()

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

export async function createShareLink(analysisId: string, userId: string) {
  const analysis = await AnalysisResult.findById(analysisId)
  if (!analysis) throw new NotFoundError('Analysis')
  if (analysis.userId.toString() !== userId) throw new ForbiddenError('Not authorized')

  const token = generateToken()
  shareTokens.set(token, { analysisId, userId, createdAt: new Date() })

  logger.info(`[Share] Created link for analysis ${analysisId}`)
  return { token, url: `/share/${token}` }
}

export async function getSharedAnalysis(token: string) {
  const entry = shareTokens.get(token)
  if (!entry) throw new NotFoundError('Shared analysis')

  const analysis = await AnalysisResult.findById(entry.analysisId).lean()
  if (!analysis) throw new NotFoundError('Analysis')

  const idea = await StartupIdea.findById(analysis.ideaId).lean()
  if (!idea) throw new NotFoundError('Startup idea')

  return {
    analysis: {
      ideaScore: analysis.ideaScore,
      successProbability: analysis.successProbability,
      marketDemand: analysis.marketDemand,
      competition: analysis.competition,
      competitors: analysis.competitors,
      swot: analysis.swot,
      revenueSuggestions: analysis.revenueSuggestions,
      growthStrategy: analysis.growthStrategy,
      mvpRoadmap: analysis.mvpRoadmap,
      createdAt: analysis.createdAt,
    },
    idea: {
      title: idea.title,
      description: idea.description,
      industry: idea.industry,
      targetAudience: idea.targetAudience,
      businessModel: idea.businessModel,
    },
    sharedAt: entry.createdAt,
  }
}
