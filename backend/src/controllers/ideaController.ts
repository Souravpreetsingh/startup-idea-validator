import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { sendSuccess, sendPaginated } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors'
import { checkAndAwardBadges } from '../services/badgeService'
import type { AuthRequest } from '../types'

export const createIdea = asyncHandler(async (req: AuthRequest, res: Response) => {
  const idea = await StartupIdea.create({
    ...req.body,
    userId: req.userId,
  })

  checkAndAwardBadges(req.userId!).catch(() => {})
  sendSuccess(res, { idea: idea.toJSON() }, 'Startup idea created successfully', 201)
})

export const getIdeas = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  const [ideas, total] = await Promise.all([
    StartupIdea.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    StartupIdea.countDocuments({ userId: req.userId }),
  ])

  sendPaginated(res, ideas, page, limit, total)
})

export const getIdea = asyncHandler(async (req: AuthRequest, res: Response) => {
  const idea = await StartupIdea.findById(req.params.id)
  if (!idea) {
    throw new NotFoundError('Startup idea')
  }

  if (idea.userId.toString() !== req.userId) {
    throw new ForbiddenError('Not authorized to access this idea')
  }

  sendSuccess(res, { idea: idea.toJSON() })
})

export const updateIdea = asyncHandler(async (req: AuthRequest, res: Response) => {
  const idea = await StartupIdea.findById(req.params.id)
  if (!idea) {
    throw new NotFoundError('Startup idea')
  }

  if (idea.userId.toString() !== req.userId) {
    throw new ForbiddenError('Not authorized to update this idea')
  }

  Object.assign(idea, req.body)
  await idea.save()

  sendSuccess(res, { idea: idea.toJSON() }, 'Startup idea updated successfully')
})

export const deleteIdea = asyncHandler(async (req: AuthRequest, res: Response) => {
  const idea = await StartupIdea.findById(req.params.id)
  if (!idea) {
    throw new NotFoundError('Startup idea')
  }

  if (idea.userId.toString() !== req.userId) {
    throw new ForbiddenError('Not authorized to delete this idea')
  }

  await idea.deleteOne()

  sendSuccess(res, null, 'Startup idea deleted successfully')
})
