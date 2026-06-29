import { Response } from 'express'
import { getUserTasks, updateTask, deleteTask } from '../services/taskService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import type { AuthRequest } from '../types'

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getUserTasks(req.userId!)
  sendSuccess(res, result)
})

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await updateTask(req.params.id as string, req.userId!, req.body)
  sendSuccess(res, { task }, 'Task updated')
})

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteTask(req.params.id as string, req.userId!)
  sendSuccess(res, null, 'Task deleted')
})
