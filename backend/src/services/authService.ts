import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import crypto from 'crypto'

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string }
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}
