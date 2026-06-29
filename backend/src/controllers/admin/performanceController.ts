import { Request, Response } from 'express'
import { getPerformanceSnapshot } from '../../services/performanceService'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'

export const getPerformance = asyncHandler(async (_req: Request, res: Response) => {
  const snapshot = getPerformanceSnapshot()
  sendSuccess(res, { performance: snapshot })
})
