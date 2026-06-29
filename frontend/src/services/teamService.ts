import api from '@/lib/api'

export interface Team {
  _id: string
  name: string
  owner: string
  members: Array<{ userId: string; role: string }>
  inviteCode?: string
}

export const teamService = {
  async create(name: string) {
    const res = await api.post('/teams', { name })
    return res.data
  },
  async list() {
    const res = await api.get('/teams')
    return res.data
  },
  async getOne(id: string) {
    const res = await api.get(`/teams/${id}`)
    return res.data
  },
  async invite(teamId: string, email: string) {
    const res = await api.post(`/teams/${teamId}/invite`, { email })
    return res.data
  },
  async acceptInvite(inviteId: string) {
    const res = await api.post(`/teams/invite/${inviteId}/accept`)
    return res.data
  },
  async updateRole(teamId: string, userId: string, role: string) {
    const res = await api.put(`/teams/${teamId}/role/${userId}`, { role })
    return res.data
  },
  async removeMember(teamId: string, userId: string) {
    const res = await api.delete(`/teams/${teamId}/members/${userId}`)
    return res.data
  },
}
