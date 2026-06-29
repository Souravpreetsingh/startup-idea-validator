'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useIdea } from '@/hooks/useIdea'
import { useFavorite } from '@/hooks/useFavorite'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import ErrorBoundary from '@/components/ErrorBoundary'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function AnalysisPage() {
  const { ideaId } = useParams<{ ideaId: string }>()
  const { user, loading: authLoading } = useAuth()
  const { analysis, loading, generating, generate } = useAnalysis(ideaId)
  const { idea, loading: ideaLoading, fetch: fetchIdea } = useIdea(ideaId)
  const { isFavorited, toggling, toggle, check } = useFavorite(ideaId)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && ideaId) { fetchIdea(); check() }
  }, [user, ideaId, fetchIdea, check])

  const exportPDF = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/export/analysis/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis-${ideaId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
    } catch {
      toast.error('Export failed')
    }
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md min-h-screen flex antialiased">
      <Sidebar />
      <main className="flex-grow md:ml-64 p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <ErrorBoundary>
          <div className="flex items-start justify-between flex-col md:flex-row gap-4">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface tracking-tighter">Analysis Results</h2>
              <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
                {ideaLoading ? 'Loading...' : `"${idea?.title || 'Startup Idea'}"`}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {analysis && (
                <>
                  <button onClick={exportPDF} className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-low transition-colors text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">download</span> Export PDF
                  </button>
                  <button onClick={toggle} disabled={toggling} className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-colors flex items-center gap-1.5 border ${isFavorited ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'}`}>
                    <span className="material-symbols-outlined text-[18px]">{isFavorited ? 'bookmark' : 'bookmark_border'}</span>
                    {isFavorited ? 'Saved' : 'Save'}
                  </button>
                </>
              )}
              {!analysis && !loading && !generating && (
                <button onClick={generate} disabled={generating} className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-50 flex items-center gap-2">
                  {generating ? <><span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><span className="material-symbols-outlined">auto_awesome</span> Run Analysis</>}
                </button>
              )}
            </div>
          </div>

          {generating && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-tertiary animate-pulse">psychology</span>
              <p className="text-on-surface-variant mt-4 text-lg">AI is analyzing your startup idea...</p>
              <p className="text-sm text-on-surface-variant mt-1">This takes 10-20 seconds</p>
            </div>
          )}

          {loading && !analysis && !generating && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">{Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}</div>
          )}

          {analysis && (
            <>
              <section className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Idea Score</span>
                    <span className="material-symbols-outlined text-tertiary">military_tech</span>
                  </div>
                  <div className="mt-4"><span className="font-display-lg text-display-lg text-on-surface leading-none">{analysis.ideaScore}</span><span className="text-body-md text-on-surface-variant">/100</span></div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start"><span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Market Demand</span><span className="material-symbols-outlined text-tertiary">monitoring</span></div>
                  <p className="mt-4 text-sm text-on-surface-variant leading-relaxed line-clamp-4">{analysis.marketDemand}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start"><span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Competition</span><span className="material-symbols-outlined text-tertiary">swords</span></div>
                  <p className="mt-4 text-sm text-on-surface-variant leading-relaxed line-clamp-4">{analysis.competition}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start"><span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Growth</span><span className="material-symbols-outlined text-tertiary">rocket_launch</span></div>
                  <p className="mt-4 text-sm text-on-surface-variant leading-relaxed line-clamp-4">{analysis.growthStrategy}</p>
                </div>
                <div className="bg-inverse-surface text-inverse-on-surface rounded-[32px] p-6 flex flex-col justify-between col-span-2 md:col-span-1">
                  <div className="flex justify-between items-start"><span className="text-label-sm text-surface-variant uppercase tracking-widest">Success Prob.</span><span className="material-symbols-outlined text-tertiary-fixed">percent</span></div>
                  <div className="mt-4"><span className="font-display-lg text-display-lg text-inverse-on-surface leading-none">{analysis.successProbability}%</span></div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-8">
                  <section>
                    <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-6">SWOT Analysis</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: 'Strengths', items: analysis.swot.strengths, color: 'bg-tertiary-fixed', icon: 'fitness_center' },
                        { title: 'Weaknesses', items: analysis.swot.weaknesses, color: 'bg-outline', icon: 'warning' },
                        { title: 'Opportunities', items: analysis.swot.opportunities, color: 'bg-primary-fixed', icon: 'lightbulb' },
                        { title: 'Threats', items: analysis.swot.threats, color: 'bg-error-container', icon: 'bolt' },
                      ].map((s) => (
                        <div key={s.title} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden">
                          <div className={`absolute top-0 left-0 w-1 h-full ${s.color}`} />
                          <div className="flex items-center gap-3 mb-4"><span className="material-symbols-outlined text-on-surface">{s.icon}</span><h4 className="text-label-md text-on-surface uppercase tracking-wider">{s.title}</h4></div>
                          <ul className="space-y-2">{s.items.map((item, i) => (<li key={i} className="flex gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-tertiary text-[18px] shrink-0">check</span>{item}</li>))}</ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {analysis.competitors?.length > 0 && (
                    <section>
                      <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-6">Competitors</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.competitors.map((comp, i) => (
                          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl">
                            <h4 className="font-bold text-on-surface mb-3">{comp.name}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div><span className="text-label-sm text-on-surface-variant uppercase block mb-1">Strengths</span><p className="text-sm text-on-surface">{comp.strengths}</p></div>
                              <div><span className="text-label-sm text-on-surface-variant uppercase block mb-1">Weaknesses</span><p className="text-sm text-on-surface">{comp.weaknesses}</p></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                  <section className="bg-surface-dim border border-outline-variant rounded-2xl p-6">
                    <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined">attach_money</span>Revenue Suggestions</h3>
                    <ul className="space-y-3">{analysis.revenueSuggestions.map((s, i) => (<li key={i} className="flex gap-2 text-sm text-on-surface-variant"><span className="text-tertiary font-bold shrink-0">{i + 1}.</span>{s}</li>))}</ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">MVP Roadmap</h3>
                    <div className="relative pl-6 border-l border-outline-variant ml-4 space-y-6">
                      {analysis.mvpRoadmap.map((step, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-tertiary-fixed border-2 border-surface" />
                          <p className="text-sm text-on-surface-variant">{step}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {!analysis && !loading && !generating && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">analytics</span>
              <p className="text-on-surface-variant text-lg mb-2">No analysis yet</p>
              <p className="text-sm text-on-surface-variant mb-6">Click "Run Analysis" to generate a comprehensive AI evaluation.</p>
              <button onClick={generate} className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors">Run Analysis</button>
            </div>
          )}
        </ErrorBoundary>
      </main>
      <MobileNav />
    </body>
  )
}
