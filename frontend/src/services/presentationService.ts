import api from '@/lib/api'

export interface Slide {
  title: string
  content: string
  bullets: string[]
  notes?: string
}

export interface Presentation {
  theme: string
  slides: Slide[]
}

export const presentationService = {
  async generate(ideaId: string) {
    const res = await api.post(`/presentation/${ideaId}`)
    return res.data
  },
  async exportPdf(ideaId: string) {
    const res = await api.get(`/presentation/${ideaId}/export?format=pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'pitch_deck.pdf'
    a.click()
    URL.revokeObjectURL(url)
  },
  async exportHtml(ideaId: string) {
    const res = await api.get(`/presentation/${ideaId}/export`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'text/html' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'pitch_deck.html'
    a.click()
    URL.revokeObjectURL(url)
  },
}
