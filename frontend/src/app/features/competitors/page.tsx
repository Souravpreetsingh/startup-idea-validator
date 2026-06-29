'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { competitorService, type CompetitorDetail } from '@/services/competitorService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function CompetitorsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [competitors, setCompetitors] = useState<CompetitorDetail[]>([])
  const [marketPosition, setMarketPosition] = useState('')
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).finally(() => setLoading(false))
  }, [user])

  async function handleAnalyze() {
    if (!selectedIdea) return
    setAnalyzing(true)
    setCompetitors([])
    try {
      const res = await competitorService.analyze(selectedIdea)
      setCompetitors(res.data.competitors || [])
      setMarketPosition(res.data.marketPosition || '')
    } catch {
      toast.error('Failed to analyze competitors')
    }
    setAnalyzing(false)
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">AI Intelligence</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Competitor Intelligence</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">AI-powered competitive analysis with funding, positioning, pricing, and user estimates.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <label className="font-label-sm text-on-surface mb-3 block">Select a startup idea</label>
            <div className="flex gap-3">
              <select value={selectedIdea} onChange={(e) => setSelectedIdea(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-on-surface">
                <option value="">Choose an idea...</option>
                {ideas.map((idea) => (
                  <option key={idea._id} value={idea._id}>{idea.title} ({idea.industry})</option>
                ))}
              </select>
              <button onClick={handleAnalyze} disabled={!selectedIdea || analyzing}
                className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
                {analyzing ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                Analyze
              </button>
            </div>
          </div>

          {analyzing && <div className="bg-surface-variant animate-pulse rounded-[32px] h-[200px]" />}

          {marketPosition && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
              <h3 className="font-label-md text-on-surface mb-2">Market Position</h3>
              <p className="text-body-md text-on-surface-variant">{marketPosition}</p>
            </div>
          )}

          {competitors.length > 0 && (
            <div className="space-y-6">
              {competitors.map((comp, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-label-lg text-on-surface">{comp.name}</h3>
                    {comp.marketPosition && (
                      <span className="bg-surface-container-low text-on-surface-variant text-[11px] px-3 py-1 rounded-full capitalize">{comp.marketPosition}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-body-sm">
                    {comp.funding && (
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Funding</p>
                        <p className="text-on-surface">{comp.funding}</p>
                      </div>
                    )}
                    {comp.pricingStrategy && (
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Pricing</p>
                        <p className="text-on-surface capitalize">{comp.pricingStrategy}</p>
                      </div>
                    )}
                    {comp.estimatedUserBase && (
                      <div>
                        <p className="text-label-sm text-on-surface-variant">User Base</p>
                        <p className="text-on-surface">{comp.estimatedUserBase}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {comp.strengths.length > 0 && (
                      <div>
                        <p className="text-label-sm text-green-700 mb-2">Strengths</p>
                        <ul className="space-y-1">
                          {comp.strengths.map((s, j) => (
                            <li key={j} className="text-body-sm text-on-surface-variant flex gap-2">
                              <span className="text-green-600 shrink-0">+</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {comp.weaknesses.length > 0 && (
                      <div>
                        <p className="text-label-sm text-red-700 mb-2">Weaknesses</p>
                        <ul className="space-y-1">
                          {comp.weaknesses.map((w, j) => (
                            <li key={j} className="text-body-sm text-on-surface-variant flex gap-2">
                              <span className="text-red-600 shrink-0">-</span>{w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && competitors.length === 0 && !analyzing && (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">business_center</span>
              <p className="text-on-surface-variant">Select an idea and run competitor analysis</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
