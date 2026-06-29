import { Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../../models/User'
import { StartupIdea } from '../../models/StartupIdea'
import { AnalysisResult } from '../../models/AnalysisResult'
import { ActivityLog } from '../../models/ActivityLog'
import { getGlobalActivityStats } from '../../services/activityService'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'

export const getDashboard = asyncHandler(async (_req: any, res: Response) => {
  const [totalUsers, totalIdeas, totalAnalyses, userGrowth, recentActivity, activityStats] =
    await Promise.all([
      User.countDocuments(),
      StartupIdea.countDocuments(),
      AnalysisResult.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
      ActivityLog.find()
        .populate('userId', 'fullName email')
        .sort({ timestamp: -1 })
        .limit(20),
      getGlobalActivityStats(30),
    ])

  sendSuccess(res, {
    stats: { totalUsers, totalIdeas, totalAnalyses },
    userGrowth,
    recentActivity,
    activity: activityStats,
  })
})

export const getUsers = asyncHandler(async (_req: any, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100)
  sendSuccess(res, { users })
})

export const getAnalytics = asyncHandler(async (_req: any, res: Response) => {
  const [ideasByIndustry, scoreDistribution] = await Promise.all([
    StartupIdea.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    AnalysisResult.aggregate([
      {
        $bucket: {
          groupBy: '$ideaScore',
          boundaries: [0, 40, 60, 80, 101],
          default: 'unknown',
          output: { count: { $sum: 1 } },
        },
      },
    ]),
  ])

  sendSuccess(res, { ideasByIndustry, scoreDistribution })
})
