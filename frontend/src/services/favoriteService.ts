import api from '@/lib/api'

export const favoriteService = {
  async getFavorites() {
    const res = await api.get('/favorites')
    return res.data
  },

  async addFavorite(ideaId: string) {
    const res = await api.post(`/favorites/${ideaId}`)
    return res.data
  },

  async removeFavorite(ideaId: string) {
    const res = await api.delete(`/favorites/${ideaId}`)
    return res.data
  },
}
