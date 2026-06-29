import { Response } from 'express'
import { StartupIdea } from '../../models/StartupIdea'
import { matchInvestors } from '../../services/investorService'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../../utils/errors'
import type { AuthRequest } from '../../types'

export const getInvestorMatch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ideaId } = req.params

  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const match = await matchInvestors(idea)
  sendSuccess(res, { match })
})
