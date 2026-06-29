import { Response } from 'express'
import { User } from '../models/User'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId)
  if (!user) {
    throw new AppError('User not found', 404)
  }

  sendSuccess(res, { user: user.toJSON() })
})

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { fullName, startupExperience, industryInterest, profileImage } = req.body

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      ...(fullName && { fullName }),
      ...(startupExperience !== undefined && { startupExperience }),
      ...(industryInterest !== undefined && { industryInterest }),
      ...(profileImage !== undefined && { profileImage }),
    },
    { new: true, runValidators: true }
  )

  if (!user) {
    throw new AppError('User not found', 404)
  }

  sendSuccess(res, { user: user.toJSON() }, 'Profile updated successfully')
})
