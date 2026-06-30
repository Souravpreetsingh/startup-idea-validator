import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'

const emergingTrends = [
  'AI-powered automation across all industries',
  'Climate tech and carbon accounting platforms',
  'Vertical AI agents for specific industries',
  'Developer experience and productivity tools',
  'Digital health and personalized medicine',
  'Generative AI for content and creative workflows',
  'Edge computing and IoT integration',
  'Cybersecurity and data privacy solutions',
  'Remote work infrastructure and collaboration tools',
  'Fintech innovation in payments and lending',
  'Sustainability and circular economy platforms',
  'No-code and low-code development tools',
]

export async function getMarketTrends() {
  const [industryCount, avgScores] = await Promise.all([
    StartupIdea.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 }, avgScore: { $avg: null } } },
      { $sort: { count: -1 } },
    ]),
    AnalysisResult.aggregate([
      {
        $lookup: {
          from: 'startupideas',
          localField: 'ideaId',
          foreignField: '_id',
          as: 'idea',
        },
      },
      { $unwind: { path: '$idea', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$idea.industry',
          avgScore: { $avg: '$ideaScore' },
          avgProb: { $avg: '$successProbability' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ])

  const trends = avgScores.map((t: any) => ({
    industry: t._id || 'Unknown',
    avgScore: Math.round(t.avgScore || 0),
    avgProbability: Math.round(t.avgProb || 0),
    analysisCount: t.count,
  }))

  const randomTrends = [...emergingTrends].sort(() => Math.random() - 0.5).slice(0, 5)

  return {
    industryBreakdown: trends,
    topIndustries: industryCount.map((i: any) => ({ industry: i._id, count: i.count })),
    emergingTrends: randomTrends,
    totalIdeas: industryCount.reduce((s: number, i: any) => s + i.count, 0),
  }
}
