import { AnalysisResult } from '../models/AnalysisResult'
import { StartupIdea, type IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

export interface BenchmarkResult {
  industryRank: string
  industryPercentile: number
  averageScore: number
  averageProbability: number
  totalInIndustry: number
  similarIdeas: Array<{
    _id: string
    title: string
    industry: string
    ideaScore: number
    successProbability: number
  }>
}

export async function benchmarkStartup(idea: IStartupIdeaDocument): Promise<BenchmarkResult> {
  const analysis = await AnalysisResult.findOne({ ideaId: idea._id }).lean()
  if (!analysis) throw new Error('No analysis found for this idea')

  const industryStartups = await StartupIdea.find({ industry: idea.industry, _id: { $ne: idea._id } }).lean()
  const industryIds = industryStartups.map(s => s._id)

  const industryAnalyses = await AnalysisResult.find({ ideaId: { $in: industryIds } }).lean()

  const scores = industryAnalyses.map(a => a.ideaScore)
  const probabilities = industryAnalyses.map(a => a.successProbability)

  const totalInIndustry = scores.length
  const avgScore = totalInIndustry > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / totalInIndustry) : 0
  const avgProb = totalInIndustry > 0 ? Math.round(probabilities.reduce((s, v) => s + v, 0) / totalInIndustry) : 0

  const betterThan = scores.filter(s => s < analysis.ideaScore).length
  const percentile = totalInIndustry > 0 ? Math.round((betterThan / totalInIndustry) * 100) : 50

  const similarAnalyses = await AnalysisResult.find({
    _id: { $ne: analysis._id },
    ideaScore: { $gte: analysis.ideaScore - 10, $lte: analysis.ideaScore + 10 },
  })
    .sort({ ideaScore: -1 })
    .limit(5)
    .lean()

  const similarIds = similarAnalyses.map(a => a.ideaId.toString())
  const similarIdeas = await StartupIdea.find({ _id: { $in: similarIds } }).lean()

  const similar = similarIdeas.map(s => {
    const a = similarAnalyses.find(an => an.ideaId.toString() === s._id.toString())
    return {
      _id: s._id.toString(),
      title: s.title,
      industry: s.industry,
      ideaScore: a?.ideaScore || 0,
      successProbability: a?.successProbability || 0,
    }
  })

  let rankLabel = 'Below Average'
  if (percentile >= 90) rankLabel = 'Top 10%'
  else if (percentile >= 75) rankLabel = 'Top 25%'
  else if (percentile >= 50) rankLabel = 'Above Average'
  else if (percentile >= 25) rankLabel = 'Average'

  logger.info(`[Benchmark] Idea ${idea._id} ranked at ${percentile}th percentile in ${idea.industry}`)

  return {
    industryRank: rankLabel,
    industryPercentile: percentile,
    averageScore: avgScore,
    averageProbability: avgProb,
    totalInIndustry,
    similarIdeas: similar,
  }
}
