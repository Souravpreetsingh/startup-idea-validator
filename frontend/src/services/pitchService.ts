import api from '@/lib/api'

export interface Pitch {
  executiveSummary: string
  problemStatement: string
  solution: string
  marketOpportunity: string
  businessModel: string
  traction: string
  ask: string
  mission: string
}

export const pitchService = {
  async generate(ideaId: string) {
    const res = await api.get(`/pitch/${ideaId}`)
    return res.data
  },
}
