import { Response } from 'express'
import { getRecommendations } from '../../services/recommendationService'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'
import type { AuthRequest } from '../../types'

export const getRecommendationsForUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const recommendations = await getRecommendations(req.userId!)
  sendSuccess(res, { recommendations })
})
