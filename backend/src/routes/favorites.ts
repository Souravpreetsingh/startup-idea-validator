import { Router, Response } from 'express'
import { authenticate } from '../middleware/auth'
import { Favorite } from '../models/Favorite'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

const router = Router()

router.use(authenticate)

router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const favorites = await Favorite.find({ userId: req.userId })
      .populate('ideaId', 'title industry description')
      .sort({ createdAt: -1 })

    sendSuccess(res, { favorites })
  })
)

router.post(
  '/:ideaId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ideaId } = req.params

    const existing = await Favorite.findOne({ userId: req.userId, ideaId })
    if (existing) {
      throw new AppError('Already bookmarked', 409)
    }

    await Favorite.create({ userId: req.userId, ideaId })
    sendSuccess(res, null, 'Bookmarked', 201)
  })
)

router.delete(
  '/:ideaId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await Favorite.findOneAndDelete({ userId: req.userId, ideaId: req.params.ideaId })
    if (!result) throw new NotFoundError('Bookmark')
    sendSuccess(res, null, 'Removed bookmark')
  })
)

export default router
