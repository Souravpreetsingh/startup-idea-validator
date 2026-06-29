'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { investorService, type InvestorMatch } from '@/services/investorService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function InvestorPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [match, setMatch] = useState<InvestorMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).finally(() => setLoading(false))
  }, [user])

  async function handleMatch() {
    if (!selectedIdea) return
    setGenerating(true)
    setMatch(null)
    try {
      const res = await investorService.getMatch(selectedIdea)
      setMatch(res.data.match)
    } catch {
      toast.error('Failed to generate investor match')
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
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Investor Match</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">Find the right investors for your startup based on your idea analysis.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <label className="font-label-sm text-on-surface mb-3 block">Select a startup idea</label>
            <div className="flex gap-3">
              <select value={selectedIdea} onChange={(e) => setSelectedIdea(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-on-surface">
                <option value="">Choose an idea...</option>
                {ideas.map((idea) => (
                  <option key={idea._id} value={idea._id}>{idea.name} ({idea.industry})</option>
                ))}
              </select>
              <button onClick={handleMatch} disabled={!selectedIdea || generating}
                className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
                {generating ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                Match Investors
              </button>
            </div>
          </div>

          {generating && <div className="bg-surface-variant animate-pulse rounded-[32px] h-[200px]" />}

          {match && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                <h3 className="font-label-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">business</span>
                  Investor Profile
                </h3>
                <div className="space-y-3">
                  <div><p className="text-label-sm text-on-surface-variant">Type</p><p className="text-body-md text-on-surface capitalize">{match.investorType}</p></div>
                  <div><p className="text-label-sm text-on-surface-variant">Funding Stage</p><p className="text-body-md text-on-surface">{match.fundingStage}</p></div>
                  <div><p className="text-label-sm text-on-surface-variant">Recommended Amount</p><p className="text-body-md text-on-surface">{match.recommendedAmount}</p></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                <h3 className="font-label-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">tips_and_updates</span>
                  Pitch Suggestions
                </h3>
                <ul className="space-y-2">
                  {match.pitchSuggestions.map((s, i) => (
                    <li key={i} className="text-body-sm text-on-surface-variant flex gap-2">
                      <span className="text-tertiary shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!loading && !match && !generating && (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">account_balance</span>
              <p className="text-on-surface-variant">Select an idea and click "Match Investors"</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
