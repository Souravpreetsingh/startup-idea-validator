import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { UserMemory } from '../models/UserMemory'

export async function getRecommendations(userId: string) {
  const userIdeas = await StartupIdea.find({ userId }).lean()
  const userIndustries = [...new Set(userIdeas.map((i) => i.industry))]

  const memory = await UserMemory.findOne({ userId })

  const similarIdeas = userIndustries.length > 0
    ? await StartupIdea.aggregate([
        { $match: { industry: { $in: userIndustries }, userId: { $ne: userId as any } } },
        { $group: { _id: '$title', industry: { $first: '$industry' }, description: { $first: '$description' } } },
        { $limit: 6 },
      ])
    : []

  const topScored = await AnalysisResult.aggregate([
    { $sort: { ideaScore: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'startupideas',
        localField: 'ideaId',
        foreignField: '_id',
        as: 'idea',
      },
    },
    { $unwind: { path: '$idea', preserveNullAndEmptyArrays: true } },
    { $match: { 'idea.userId': { $ne: userId as any } } },
    { $project: { 'idea.title': 1, 'idea.industry': 1, ideaScore: 1 } },
  ])

  const trendingIndustries = await StartupIdea.aggregate([
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ])

  return {
    userIndustries,
    preferences: memory?.preferences || [],
    previousIdeas: memory?.previousIdeas || [],
    similarIdeas,
    topScored,
    trendingIndustries,
  }
}
