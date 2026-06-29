import { Response } from 'express'
import { Task } from '../models/Task'
import { generateIcsBlob, googleCalendarUrl } from '../services/calendarService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const downloadIcs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
  if (!task || !task.deadline) throw new NotFoundError('Task with deadline')

  const start = new Date(task.deadline)
  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const ics = generateIcsBlob({
    title: task.title,
    description: task.description || '',
    start,
    end,
  })

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${task.title.replace(/\s+/g, '_')}.ics"`)
  res.send(ics)
})

export const getGoogleCalendarUrl = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
  if (!task || !task.deadline) throw new NotFoundError('Task with deadline')

  const start = new Date(task.deadline)
  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const url = googleCalendarUrl({
    title: task.title,
    description: task.description || '',
    start,
    end,
  })

  sendSuccess(res, { url })
})
