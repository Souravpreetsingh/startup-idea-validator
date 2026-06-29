'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

const tools = [
  { path: '/features/investor', icon: 'account_balance', title: 'Investor Match', desc: 'AI-powered investor matching based on your startup profile' },
  { path: '/features/pitch', icon: 'campaign', title: 'Pitch Generator', desc: 'Generate compelling pitch decks from your analysis' },
  { path: '/features/trends', icon: 'trending_up', title: 'Market Trends', desc: 'Real-time market trends and industry insights' },
  { path: '/features/badges', icon: 'stars', title: 'Achievements', desc: 'Earn badges as you validate your startup ideas' },
  { path: '/features/recommendations', icon: 'recommend', title: 'Recommendations', desc: 'Personalized recommendations based on your activity' },
  { path: '/features/competitors', icon: 'business_center', title: 'Competitor Intel', desc: 'Deep competitor analysis with funding, pricing, and positioning' },
  { path: '/features/versions', icon: 'history', title: 'Idea Versioning', desc: 'Track, compare, and restore previous idea versions' },
  { path: '/features/tasks', icon: 'task_alt', title: 'Smart Tasks', desc: 'AI-generated action plans with progress tracking' },
  { path: '/features/presentation', icon: 'slideshow', title: 'Pitch Presentation', desc: 'Generate investor-ready slide decks with AI' },
  { path: '/features/benchmarking', icon: 'compare_arrows', title: 'Score Benchmarking', desc: 'Rank your idea against industry peers' },
  { path: '/features/mentor', icon: 'school', title: 'Mentor Match', desc: 'AI-recommended mentors for your startup' },
]

export default function FeaturesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Tools &amp; Features</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">
              Launchpad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <button key={tool.path} onClick={() => router.push(tool.path)}
                className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 text-left hover:shadow-lg transition-all hover:-translate-y-1">
                <span className="material-symbols-outlined text-4xl text-tertiary mb-4">{tool.icon}</span>
                <h3 className="font-label-md text-on-surface mb-2">{tool.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
