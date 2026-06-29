'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { recommendationService, type Recommendation } from '@/services/recommendationService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

export default function RecommendationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    recommendationService.getRecommendations()
      .then((r) => setRecommendations(r.data.recommendations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">AI Curated</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Recommendations</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">Personalized suggestions based on your idea validation activity.</p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-variant animate-pulse rounded-[32px] h-[200px]" />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">recommend</span>
              <p className="text-on-surface-variant text-lg mb-2">No recommendations yet</p>
              <p className="text-sm text-on-surface-variant">Create and analyze more ideas to get personalized recommendations.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h3 className="font-label-md text-on-surface mb-4 capitalize flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">
                      {rec.type === 'similar' ? 'similar' : rec.type === 'trending' ? 'trending_up' : 'lightbulb'}
                    </span>
                    {rec.type.replace(/_/g, ' ')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rec.ideas.map((idea) => (
                      <button key={idea._id} onClick={() => router.push(`/analysis/${idea._id}`)}
                        className="bg-surface-container-low rounded-2xl px-4 py-3 text-left hover:bg-surface-container-lowest transition-colors">
                        <p className="font-label-sm text-on-surface">{idea.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{idea.industry}</p>
                        {idea.ideaScore != null && (
                          <p className="text-[11px] text-tertiary mt-1">Score: {idea.ideaScore}/100</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
