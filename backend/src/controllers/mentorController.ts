import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { recommendMentors } from '../services/mentorService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const getMentor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const analysis = await AnalysisResult.findOne({ ideaId })
  const { goals } = req.body || {}
  const recommendation = await recommendMentors(idea, analysis, goals)

  sendSuccess(res, { recommendation })
})
