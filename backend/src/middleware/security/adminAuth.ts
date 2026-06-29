import { Response, NextFunction } from 'express'
import { User } from '../../models/User'
import { ForbiddenError } from '../../utils/errors'
import type { AuthRequest } from '../../types'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase())

export async function adminOnly(req: AuthRequest, _res: Response, next: NextFunction) {
  const user = await User.findById(req.userId)
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    throw new ForbiddenError('Admin access required')
  }
  next()
}
