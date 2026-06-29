import { Response, NextFunction } from 'express'
import { logActivity } from '../services/activityService'
import type { AuthRequest } from '../types'

export function trackActivity(category: string, action?: string) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userId = req.userId
    if (userId) {
      const actionName =
        action || `${req.method} ${req.originalUrl?.replace(/\/api\//, '')}`
      logActivity(userId, actionName, category as any, {}, req.ip)
    }
    next()
  }
}
