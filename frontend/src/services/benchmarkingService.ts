import api from '@/lib/api'

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

export const benchmarkingService = {
  async getBenchmark(ideaId: string) {
    const res = await api.get(`/benchmarking/${ideaId}`)
    return res.data
  },
}
