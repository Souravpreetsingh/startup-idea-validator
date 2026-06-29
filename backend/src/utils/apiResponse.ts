import { Response } from 'express'

export function sendSuccess(res: Response, data: unknown, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export function sendError(res: Response, message: string, statusCode = 500, errors?: unknown) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  })
}

export function sendPaginated(
  res: Response,
  data: unknown[],
  page: number,
  limit: number,
  total: number
) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
