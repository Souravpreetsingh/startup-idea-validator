import api from '@/lib/api'

export interface CompetitorDetail {
  name: string
  funding?: string
  strengths: string[]
  weaknesses: string[]
  marketPosition?: string
  pricingStrategy?: string
  estimatedUserBase?: string
}

export const competitorService = {
  async analyze(ideaId: string) {
    const res = await api.post(`/competitors/${ideaId}/analyze`)
    return res.data
  },
  async getInsight(ideaId: string) {
    const res = await api.get(`/competitors/${ideaId}`)
    return res.data
  },
}
