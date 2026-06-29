import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    if (!result.success) {
      return _res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }

    next()
  }
}
