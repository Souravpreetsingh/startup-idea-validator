import { Response } from 'express'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { getOrCreateMemory, updatePreferences, syncPreviousIdeas } from '../services/memoryService'
import type { AuthRequest } from '../types'

export const getMemory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await syncPreviousIdeas(req.userId!)
  const memory = await getOrCreateMemory(req.userId!)
  sendSuccess(res, { memory: memory.toJSON() })
})

export const updateMemory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { preferences } = req.body
  if (preferences) {
    await updatePreferences(req.userId!, preferences)
  }
  await syncPreviousIdeas(req.userId!)
  const memory = await getOrCreateMemory(req.userId!)
  sendSuccess(res, { memory: memory.toJSON() }, 'Memory updated')
})
