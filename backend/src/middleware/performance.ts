import { Request, Response, NextFunction } from 'express'
import { recordMetric } from '../services/performanceService'

export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    recordMetric(req, res, duration)
  })

  next()
}
