import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AuthRequest } from '../types'
import { UnauthorizedError } from '../utils/errors'

interface JwtPayload {
  userId: string
  iat: number
  exp: number
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    req.userId = decoded.userId
    next()
  } catch {
    throw new UnauthorizedError('Invalid or expired token')
  }
}
