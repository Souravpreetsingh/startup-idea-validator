import { Request, Response, NextFunction } from 'express'

const ALLOWED_PROTOCOLS = ['http', 'https', 'mailto']

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      sanitized[k] = sanitizeValue(v)
    }
    return sanitized
  }
  return value
}

export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeValue(req.body) as typeof req.body
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      req.query[key] = sanitizeValue(req.query[key]) as string
    }
  }
  next()
}
