import api from '@/lib/api'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
}

export const badgeService = {
  async getBadges() {
    const res = await api.get('/badges')
    return res.data
  },
  async refresh() {
    const res = await api.post('/badges/refresh')
    return res.data
  },
}
