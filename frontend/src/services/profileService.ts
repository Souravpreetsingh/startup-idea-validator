import api from '@/lib/api'

export interface ProfileUpdate {
  fullName?: string
  startupExperience?: string
  industryInterest?: string
  profileImage?: string
}

export const profileService = {
  async getProfile() {
    const res = await api.get('/user/profile')
    return res.data
  },

  async updateProfile(data: ProfileUpdate) {
    const res = await api.put('/user/profile', data)
    return res.data
  },
}
