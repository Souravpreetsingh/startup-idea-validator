import api from '@/lib/api'

export interface IdeaVersion {
  _id: string
  ideaId: string
  version: number
  snapshot: Record<string, unknown>
  changes: Array<{ field: string; oldValue: unknown; newValue: unknown }>
  createdAt: string
}

export const versionService = {
  async create(ideaId: string) {
    const res = await api.post(`/versions/${ideaId}`)
    return res.data
  },
  async list(ideaId: string) {
    const res = await api.get(`/versions/${ideaId}`)
    return res.data
  },
  async getOne(ideaId: string, version: number) {
    const res = await api.get(`/versions/${ideaId}/${version}`)
    return res.data
  },
  async restore(ideaId: string, version: number) {
    const res = await api.post(`/versions/${ideaId}/${version}/restore`)
    return res.data
  },
}
