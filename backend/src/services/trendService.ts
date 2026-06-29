import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

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

  let aiTrends: string[] = []
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `List the top 5 emerging technology trends for startups in 2025-2026. Return ONLY a JSON array of strings: ["trend1", "trend2", "trend3", "trend4", "trend5"]`
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
    aiTrends = JSON.parse(cleaned)
  } catch {
    aiTrends = ['AI/ML Integration', 'Climate Tech', 'Health Tech', 'Fintech Innovation', 'Developer Tools']
  }

  return {
    industryBreakdown: trends,
    topIndustries: industryCount.map((i: any) => ({ industry: i._id, count: i.count })),
    emergingTrends: aiTrends,
    totalIdeas: industryCount.reduce((s: number, i: any) => s + i.count, 0),
  }
}
