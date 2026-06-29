import api from '@/lib/api'

export const shareService = {
  async createLink(analysisId: string) {
    const res = await api.post('/share', { analysisId })
    return res.data
  },
  async getShared(token: string) {
    const res = await api.get(`/share/${token}`)
    return res.data
  },
}
