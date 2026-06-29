import api from '@/lib/api'

export interface Competitor {
  name: string
  strengths: string
  weaknesses: string
}

export interface Swot {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface Analysis {
  _id: string
  ideaId: string
  userId: string
  ideaScore: number
  marketDemand: string
  competition: string
  competitors: Competitor[]
  swot: Swot
  revenueSuggestions: string[]
  growthStrategy: string
  mvpRoadmap: string[]
  successProbability: number
  createdAt: string
}

export const analysisService = {
  async generateAnalysis(ideaId: string) {
    const res = await api.post('/analysis/generate', { ideaId })
    return res.data
  },

  async getAnalysis(ideaId: string) {
    const res = await api.get(`/analysis/${ideaId}`)
    return res.data
  },

  async getAllAnalyses(page = 1, limit = 10) {
    const res = await api.get(`/analysis?page=${page}&limit=${limit}`)
    return res.data
  },
}
