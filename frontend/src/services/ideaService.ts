import api from '@/lib/api'

export interface IdeaData {
  title: string
  description: string
  industry: string
  targetAudience?: string
  budget?: string
  businessModel?: string
  problemStatement?: string
  expectedSolution?: string
}

export interface Idea extends IdeaData {
  _id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export const ideaService = {
  async createIdea(data: IdeaData) {
    const res = await api.post('/ideas/create', data)
    return res.data
  },

  async getIdeas(page = 1, limit = 10) {
    const res = await api.get(`/ideas?page=${page}&limit=${limit}`)
    return res.data
  },

  async getIdeaById(id: string) {
    const res = await api.get(`/ideas/${id}`)
    return res.data
  },

  async updateIdea(id: string, data: Partial<IdeaData>) {
    const res = await api.put(`/ideas/${id}`, data)
    return res.data
  },

  async deleteIdea(id: string) {
    const res = await api.delete(`/ideas/${id}`)
    return res.data
  },
}
