import api from '@/lib/api'

export interface Task {
  _id: string
  userId: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  deadline?: string
  completedAt?: string
  createdAt: string
}

export const taskService = {
  async list() {
    const res = await api.get('/tasks')
    return res.data
  },
  async update(id: string, data: Partial<Task>) {
    const res = await api.put(`/tasks/${id}`, data)
    return res.data
  },
  async remove(id: string) {
    const res = await api.delete(`/tasks/${id}`)
    return res.data
  },
  async downloadIcs(id: string) {
    const res = await api.get(`/calendar/${id}/ics`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'text/calendar' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'task.ics'
    a.click()
    URL.revokeObjectURL(url)
  },
  async getGoogleCalendarUrl(id: string) {
    const res = await api.get(`/calendar/${id}/google`)
    return res.data
  },
}
