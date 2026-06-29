import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { benchmarkStartup } from '../services/benchmarkingService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const getBenchmark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const analysis = await AnalysisResult.findOne({ ideaId })
  if (!analysis) throw new NotFoundError('Analysis')

  const benchmark = await benchmarkStartup(idea)
  sendSuccess(res, { benchmark })
})
