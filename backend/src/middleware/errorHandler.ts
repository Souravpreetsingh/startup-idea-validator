import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { ZodError } from 'zod'
import logger from '../config/logger'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(`${err.name}: ${err.message}`, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  })

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: (err as any).errors || undefined,
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.message,
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    })
  }

  if ((err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value',
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
}
