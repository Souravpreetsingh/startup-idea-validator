import { Response } from 'express'
import { getMarketTrends } from '../../services/trendService'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'

export const getTrends = asyncHandler(async (_req: any, res: Response) => {
  const trends = await getMarketTrends()
  sendSuccess(res, { trends })
})
