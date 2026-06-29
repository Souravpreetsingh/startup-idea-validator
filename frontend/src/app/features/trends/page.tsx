'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { trendService, type MarketTrend } from '@/services/trendService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import ErrorBoundary from '@/components/ErrorBoundary'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const COLORS = ['#d6bee5', '#c7c8b5', '#5e6050', '#6a5778', '#e3e4d0', '#b8a9c9']

export default function TrendsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [trends, setTrends] = useState<MarketTrend | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    trendService.getTrends().then((r) => setTrends(r.data.trends)).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Market Intelligence</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Market Trends</h2>
          </div>

          <ErrorBoundary>
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface-variant animate-pulse rounded-[32px] h-[250px]" />
                ))}
              </div>
            ) : !trends ? (
              <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">trending_up</span>
                <p className="text-on-surface-variant">No trend data available yet. Create more analyses to see market trends.</p>
              </div>
            ) : (
              <>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-8">
                  <h3 className="font-label-md text-on-surface mb-6">Industry Breakdown</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={trends.industryBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e2df" />
                      <XAxis type="number" domain={[0, 100]} stroke="#78776f" fontSize={12} />
                      <YAxis dataKey="industry" type="category" width={140} stroke="#78776f" fontSize={12} />
                      <Tooltip
                        contentStyle={{ background: '#fcf9f6', border: '1px solid #c8c7bd', borderRadius: '8px', fontSize: '13px' }}
                      />
                      <Bar dataKey="avgScore" name="Avg Score" radius={[0, 8, 8, 0]} fill="#6a5778" />
                      <Bar dataKey="avgProbability" name="Avg Probability" radius={[0, 8, 8, 0]} fill="#c7c8b5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {trends.emergingTrends.length > 0 && (
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                    <h3 className="font-label-md text-on-surface mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary">rocket_launch</span>
                      AI-Generated Emerging Trends
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trends.emergingTrends.map((t, i) => (
                        <div key={i} className="bg-surface-container-low rounded-2xl px-4 py-3 text-body-sm text-on-surface-variant flex gap-2">
                          <span className="text-tertiary shrink-0">✦</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </ErrorBoundary>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
