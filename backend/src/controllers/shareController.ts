import { Response } from 'express'
import { createShareLink, getSharedAnalysis } from '../services/shareService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import type { AuthRequest } from '../types'

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { analysisId } = req.body
  const result = await createShareLink(analysisId, req.userId!)
  sendSuccess(res, result, 'Share link created', 201)
})

export const getShared = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await getSharedAnalysis(req.params.token as string)
  sendSuccess(res, data)
})
