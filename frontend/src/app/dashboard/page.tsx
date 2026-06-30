'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { analysisService, type Analysis } from '@/services/analysisService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import ErrorBoundary from '@/components/ErrorBoundary'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts'

const COLORS = ['#d6bee5', '#c7c8b5', '#5e6050', '#6a5778', '#e3e4d0']

function AnimatedStat({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between h-[160px]">
      <p className="text-label-sm text-on-surface-variant uppercase tracking-widest">{label}</p>
      <div className="mt-2">
        <span className="font-display-lg text-display-lg text-on-surface leading-none">{value}</span>
        {suffix && <span className="text-body-md text-on-surface-variant ml-1">{suffix}</span>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    setError(null)
    Promise.all([
      ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).catch((e) => {}),
      analysisService.getAllAnalyses(1, 100).then((r) => setAnalyses(r.data?.analyses || [])).catch((e) => {
        if (e?.response) setError('Failed to load dashboard data')
        else setError('Unable to reach the server. Please try again.')
      }),
    ]).finally(() => setLoading(false))
  }, [user])

  const avgScore = useMemo(() => {
    if (!analyses.length) return 0
    return Math.round(analyses.reduce((s, a) => s + a.ideaScore, 0) / analyses.length)
  }, [analyses])

  const avgProb = useMemo(() => {
    if (!analyses.length) return 0
    return Math.round(analyses.reduce((s, a) => s + a.successProbability, 0) / analyses.length)
  }, [analyses])

  const industryData = useMemo(() => {
    const map: Record<string, number> = {}
    ideas.forEach((i) => {
      map[i.industry] = (map[i.industry] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [ideas])

  const scoreRangeData = useMemo(() => {
    const ranges = [
      { name: '0-40', count: 0 },
      { name: '41-60', count: 0 },
      { name: '61-80', count: 0 },
      { name: '81-100', count: 0 },
    ]
    analyses.forEach((a) => {
      if (a.ideaScore <= 40) ranges[0].count++
      else if (a.ideaScore <= 60) ranges[1].count++
      else if (a.ideaScore <= 80) ranges[2].count++
      else ranges[3].count++
    })
    return ranges
  }, [analyses])

  const timelineData = useMemo(() => {
    const map: Record<string, number> = {}
    analyses.forEach((a) => {
      const date = new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      map[date] = (map[date] || 0) + 1
    })
    return Object.entries(map).map(([date, count]) => ({ date, count })).slice(-14)
  }, [analyses])

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-4">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Analytics Dashboard</p>
              <h2 className="font-display-xl text-[clamp(32px,4vw,56px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">
                Welcome back{user.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
              </h2>
            </div>
            <button onClick={() => router.push('/ideas/new')}
              className="mt-4 md:mt-0 bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors">
              New Analysis
            </button>
          </div>

          <ErrorBoundary>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface-variant animate-pulse rounded-[32px] h-[160px]" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-error-container text-on-error-container rounded-[32px] p-6 mb-8 text-center">
                <p className="font-label-md mb-1">Connection Error</p>
                <p className="text-sm">{error}</p>
                <button onClick={() => { setLoading(true); setError(null); window.location.reload() }}
                  className="mt-4 bg-on-error-container text-error-container px-6 py-2 rounded-full font-label-md">
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <AnimatedStat label="Ideas Analyzed" value={ideas.length} />
                <AnimatedStat label="Avg. Idea Score" value={avgScore} suffix="/100" />
                <AnimatedStat label="Avg. Success Prob." value={`${avgProb}%`} />
                <div className="bg-inverse-surface text-inverse-on-surface rounded-[32px] p-6 flex flex-col justify-between h-[160px]">
                  <p className="text-label-sm text-surface-variant uppercase tracking-widest">Industries</p>
                  <p className="font-display-lg text-display-lg leading-none mt-2">{industryData.length}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                <h3 className="font-label-md text-on-surface uppercase tracking-wider mb-6">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scoreRangeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e2df" />
                    <XAxis dataKey="name" stroke="#78776f" fontSize={12} />
                    <YAxis stroke="#78776f" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: '#fcf9f6',
                        border: '1px solid #c8c7bd',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {scoreRangeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                <h3 className="font-label-md text-on-surface uppercase tracking-wider mb-6">Industries</h3>
                {industryData.length === 0 ? (
                  <div className="flex items-center justify-center h-[250px] text-on-surface-variant text-sm">
                    No data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={industryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {industryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {timelineData.length > 1 && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-8">
                <h3 className="font-label-md text-on-surface uppercase tracking-wider mb-6">Analysis Activity</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e2df" />
                    <XAxis dataKey="date" stroke="#78776f" fontSize={11} />
                    <YAxis stroke="#78776f" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6a5778" strokeWidth={2} dot={{ fill: '#6a5778', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {!loading && analyses.length === 0 && (
              <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">analytics</span>
                <p className="text-on-surface-variant text-lg mb-2">No analyses yet</p>
                <p className="text-sm text-on-surface-variant mb-6">Create your first startup idea and run an AI analysis.</p>
                <button onClick={() => router.push('/ideas/new')}
                  className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors">
                  Get Started
                </button>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
