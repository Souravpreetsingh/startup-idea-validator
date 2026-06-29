import { useState, useCallback } from 'react'
import { ideaService, type Idea, type IdeaData } from '@/services/ideaService'
import toast from 'react-hot-toast'

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)

  const fetchIdeas = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await ideaService.getIdeas(page)
      setIdeas(res.data || [])
    } catch {
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createIdea = useCallback(async (data: IdeaData) => {
    try {
      const res = await ideaService.createIdea(data)
      toast.success('Idea created!')
      return res.data.idea
    } catch {
      return null
    }
  }, [])

  return { ideas, loading, fetchIdeas, createIdea }
}

export function useIdea(id: string) {
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await ideaService.getIdeaById(id)
      setIdea(res.data.idea)
    } catch {
      setIdea(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  return { idea, loading, fetch }
}
