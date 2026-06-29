import { useState, useCallback } from 'react'
import { analysisService, type Analysis } from '@/services/analysisService'
import toast from 'react-hot-toast'

export function useAnalysis(ideaId: string) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const fetch = useCallback(async () => {
    if (!ideaId) return
    setLoading(true)
    try {
      const res = await analysisService.getAnalysis(ideaId)
      setAnalysis(res.data.analysis)
    } catch {
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }, [ideaId])

  const generate = useCallback(async () => {
    setGenerating(true)
    try {
      const res = await analysisService.generateAnalysis(ideaId)
      setAnalysis(res.data.analysis)
      toast.success('Analysis complete!')
      return res.data.analysis
    } catch {
      toast.error('Analysis failed. Try again.')
      return null
    } finally {
      setGenerating(false)
    }
  }, [ideaId])

  return { analysis, loading, generating, fetch, generate }
}
