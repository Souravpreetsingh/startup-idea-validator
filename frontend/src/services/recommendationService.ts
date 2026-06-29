import api from '@/lib/api'

export interface Recommendation {
  type: string
  ideas: Array<{
    _id: string
    name: string
    industry: string
    ideaScore?: number
  }>
}

export const recommendationService = {
  async getRecommendations() {
    const res = await api.get('/recommendations')
    return res.data
  },
}
