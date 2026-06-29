import { Router, Response } from 'express'
import { authenticate } from '../middleware/auth'
import { getActivityStats } from '../services/activityService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import type { AuthRequest } from '../types'

const router = Router()

router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const days = parseInt(req.query.days as string) || 30
    const stats = await getActivityStats(req.userId!, days)
    sendSuccess(res, { stats })
  })
)

export default router
