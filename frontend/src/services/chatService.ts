import api from '@/lib/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Chat {
  _id: string
  title: string
  messages: ChatMessage[]
  updatedAt: string
  createdAt: string
}

export const chatService = {
  async sendMessage(message: string, chatId?: string) {
    const res = await api.post('/chat', { message, chatId })
    return res.data
  },

  async getChatHistory(page = 1, limit = 20) {
    const res = await api.get(`/chat?page=${page}&limit=${limit}`)
    return res.data
  },

  async getChatById(id: string) {
    const res = await api.get(`/chat/${id}`)
    return res.data
  },

  async deleteChat(id: string) {
    const res = await api.delete(`/chat/${id}`)
    return res.data
  },
}
