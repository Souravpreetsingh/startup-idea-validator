import api from '@/lib/api'

export interface MentorRecommendation {
  mentorType: string
  expertise: string[]
  skillsNeeded: string[]
  guidanceTopics: string[]
  suggestedBackground: string
}

export const mentorService = {
  async getRecommendation(ideaId: string, goals?: string) {
    const res = await api.post(`/mentor/${ideaId}`, { goals })
    return res.data
  },
}
