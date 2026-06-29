import api from '@/lib/api'

export interface InvestorMatch {
  investorType: string
  fundingStage: string
  recommendedAmount: string
  pitchSuggestions: string[]
}

export const investorService = {
  async getMatch(ideaId: string) {
    const res = await api.get(`/investor/${ideaId}`)
    return res.data
  },
}
