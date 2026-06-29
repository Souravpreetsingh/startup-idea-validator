'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { benchmarkingService, type BenchmarkResult } from '@/services/benchmarkingService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function BenchmarkingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [comparing, setComparing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).finally(() => setLoading(false))
  }, [user])

  async function handleCompare() {
    if (!selectedIdea) return
    setComparing(true)
    setBenchmark(null)
    try {
      const res = await benchmarkingService.getBenchmark(selectedIdea)
      setBenchmark(res.data.benchmark)
    } catch {
      toast.error('Failed to benchmark')
    }
    setComparing(false)
  }

  const percentileColor = benchmark
    ? benchmark.industryPercentile >= 75 ? 'text-green-600'
      : benchmark.industryPercentile >= 50 ? 'text-blue-600'
      : benchmark.industryPercentile >= 25 ? 'text-yellow-600'
      : 'text-red-600'
    : ''

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Analytics</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Score Benchmarking</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">Compare your startup idea against others in the same industry.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <label className="font-label-sm text-on-surface mb-3 block">Select your startup idea</label>
            <div className="flex gap-3">
              <select value={selectedIdea} onChange={(e) => setSelectedIdea(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-on-surface">
                <option value="">Choose an idea...</option>
                {ideas.map((idea) => (
                  <option key={idea._id} value={idea._id}>{idea.title} ({idea.industry})</option>
                ))}
              </select>
              <button onClick={handleCompare} disabled={!selectedIdea || comparing}
                className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
                {comparing ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                Compare
              </button>
            </div>
          </div>

          {comparing && <div className="bg-surface-variant animate-pulse rounded-[32px] h-[300px]" />}

          {benchmark && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 text-center">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Industry Rank</p>
                  <p className={`font-display-lg text-[28px] leading-none font-medium ${percentileColor}`}>{benchmark.industryRank}</p>
                  <p className="text-[12px] text-on-surface-variant mt-1">{benchmark.industryPercentile}th percentile</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 text-center">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Avg Score</p>
                  <p className="font-display-lg text-[28px] leading-none font-medium text-on-surface">{benchmark.averageScore}/100</p>
                  <p className="text-[12px] text-on-surface-variant mt-1">Industry average</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 text-center">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Avg Probability</p>
                  <p className="font-display-lg text-[28px] leading-none font-medium text-on-surface">{benchmark.averageProbability}%</p>
                  <p className="text-[12px] text-on-surface-variant mt-1">Industry average</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 text-center">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Total Compared</p>
                  <p className="font-display-lg text-[28px] leading-none font-medium text-on-surface">{benchmark.totalInIndustry}</p>
                  <p className="text-[12px] text-on-surface-variant mt-1">Startups in industry</p>
                </div>
              </div>

              {benchmark.similarIdeas.length > 0 && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h3 className="font-label-md text-on-surface mb-4">Similar Scoring Ideas</h3>
                  <div className="space-y-3">
                    {benchmark.similarIdeas.map((idea) => (
                      <div key={idea._id} className="flex items-center justify-between bg-surface-container-low rounded-2xl px-4 py-3">
                        <div>
                          <p className="font-label-sm text-on-surface">{idea.title}</p>
                          <p className="text-[11px] text-on-surface-variant">{idea.industry}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-label-sm text-on-surface">{idea.ideaScore}/100</p>
                          <p className="text-[11px] text-on-surface-variant">{idea.successProbability}% prob.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !benchmark && !comparing && (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">compare_arrows</span>
              <p className="text-on-surface-variant">Select an analyzed idea to see how it ranks</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
