'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { mentorService, type MentorRecommendation } from '@/services/mentorService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function MentorPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [goals, setGoals] = useState('')
  const [recommendation, setRecommendation] = useState<MentorRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).finally(() => setLoading(false))
  }, [user])

  async function handleRecommend() {
    if (!selectedIdea) return
    setGenerating(true)
    setRecommendation(null)
    try {
      const res = await mentorService.getRecommendation(selectedIdea, goals)
      setRecommendation(res.data.recommendation)
    } catch {
      toast.error('Failed to get mentor recommendation')
    }
    setGenerating(false)
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">AI Tool</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">AI Mentor Match</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">Get personalized mentor recommendations based on your startup profile.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <label className="font-label-sm text-on-surface mb-3 block">Select your startup idea</label>
            <select value={selectedIdea} onChange={(e) => setSelectedIdea(e.target.value)}
              className="w-full mb-4 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-on-surface">
              <option value="">Choose an idea...</option>
              {ideas.map((idea) => (
                <option key={idea._id} value={idea._id}>{idea.title} ({idea.industry})</option>
              ))}
            </select>

            <label className="font-label-sm text-on-surface mb-3 block">Your goals (optional)</label>
            <textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={3} placeholder="e.g. I want to raise seed funding, build a team, and launch in 3 months..."
              className="w-full mb-4 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:border-on-surface resize-none" />

            <button onClick={handleRecommend} disabled={!selectedIdea || generating}
              className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
              {generating ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
              Find Mentor
            </button>
          </div>

          {generating && <div className="bg-surface-variant animate-pulse rounded-[32px] h-[300px]" />}

          {recommendation && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-3xl text-tertiary">school</span>
                  <div>
                    <h3 className="font-label-md text-on-surface">Recommended Mentor</h3>
                    <p className="text-body-md text-on-surface">{recommendation.mentorType}</p>
                  </div>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">{recommendation.suggestedBackground}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h4 className="font-label-sm text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-lg">psychology</span>
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.expertise.map((e, i) => (
                      <span key={i} className="bg-surface-container-low text-on-surface-variant text-[12px] px-3 py-1 rounded-full">{e}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h4 className="font-label-sm text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-lg">build</span>
                    Skills Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.skillsNeeded.map((s, i) => (
                      <span key={i} className="bg-surface-container-low text-on-surface-variant text-[12px] px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h4 className="font-label-sm text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-lg">explore</span>
                    Guidance Topics
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.guidanceTopics.map((t, i) => (
                      <li key={i} className="text-body-sm text-on-surface-variant flex gap-2">
                        <span className="text-tertiary shrink-0">•</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!loading && !recommendation && !generating && (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">school</span>
              <p className="text-on-surface-variant">Select an idea and find your ideal mentor</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
