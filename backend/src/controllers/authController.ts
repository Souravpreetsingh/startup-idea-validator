import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { generateToken } from '../services/authService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError, UnauthorizedError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password, startupExperience, industryInterest } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError('Email already registered', 409)
  }

  const user = await User.create({
    fullName,
    email,
    password,
    startupExperience,
    industryInterest,
  })

  const token = generateToken(user._id.toString())

  sendSuccess(
    res,
    {
      user: user.toJSON(),
      token,
    },
    'Account created successfully',
    201
  )
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const token = generateToken(user._id.toString())

  sendSuccess(res, {
    user: user.toJSON(),
    token,
  })
})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, null, 'Logged out successfully')
})

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId)
  if (!user) {
    throw new AppError('User not found', 404)
  }

  sendSuccess(res, { user: user.toJSON() })
})

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    sendSuccess(res, null, 'If that email is registered, a reset link has been sent')
    return
  }

  sendSuccess(res, null, 'If that email is registered, a reset link has been sent')
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body

  sendSuccess(res, null, 'Password reset successful')
})
