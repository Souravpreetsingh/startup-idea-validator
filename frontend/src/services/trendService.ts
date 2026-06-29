import api from '@/lib/api'

export interface IndustryTrend {
  industry: string
  avgScore: number
  avgProbability: number
  ideaCount: number
}

export interface MarketTrend {
  industryBreakdown: IndustryTrend[]
  emergingTrends: string[]
  generatedAt: string
}

export const trendService = {
  async getTrends() {
    const res = await api.get('/trends')
    return res.data
  },
}
