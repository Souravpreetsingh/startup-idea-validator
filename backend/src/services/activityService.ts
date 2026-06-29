import { ActivityLog } from '../models/ActivityLog'

type Category = 'auth' | 'idea' | 'analysis' | 'chat' | 'upload' | 'export'

export async function logActivity(
  userId: string,
  action: string,
  category: Category,
  metadata?: Record<string, unknown>,
  ip?: string
) {
  try {
    await ActivityLog.create({ userId, action, category, metadata, ip })
  } catch {
    // Silently fail — logging should never break the app
  }
}

export async function getActivityStats(userId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [total, byCategory, daily] = await Promise.all([
    ActivityLog.countDocuments({ userId, timestamp: { $gte: since } }),
    ActivityLog.aggregate([
      { $match: { userId: userId as any, timestamp: { $gte: since } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ActivityLog.aggregate([
      { $match: { userId: userId as any, timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  return { total, byCategory, daily }
}

export async function getGlobalActivityStats(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [total, byCategory, daily] = await Promise.all([
    ActivityLog.countDocuments({ timestamp: { $gte: since } }),
    ActivityLog.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ActivityLog.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  return { total, byCategory, daily }
}
