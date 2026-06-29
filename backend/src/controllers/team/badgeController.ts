import { Response } from 'express'
import { getUserBadges, checkAndAwardBadges } from '../../services/badgeService'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'
import type { AuthRequest } from '../../types'

export const getBadges = asyncHandler(async (req: AuthRequest, res: Response) => {
  const badges = await getUserBadges(req.userId!)
  sendSuccess(res, { badges })
})

export const refreshBadges = asyncHandler(async (req: AuthRequest, res: Response) => {
  const newBadges = await checkAndAwardBadges(req.userId!)
  const badges = await getUserBadges(req.userId!)
  sendSuccess(res, { badges, newBadges }, newBadges.length ? `New badges: ${newBadges.join(', ')}` : 'No new badges')
})
