'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const features = [
  { icon: 'insights', title: 'AI-Powered Analysis', desc: 'Get instant market demand, competition, and SWOT analysis for any startup idea.' },
  { icon: 'groups', title: 'Competitor Intelligence', desc: 'Identify key competitors, their strengths, and market positioning.' },
  { icon: 'account_balance', title: 'Investor Matching', desc: 'Find the right investors and mentors for your industry.' },
  { icon: 'trending_up', title: 'Revenue Modeling', desc: 'Data-driven revenue suggestions and growth strategy blueprints.' },
  { icon: 'lightbulb', title: 'Pitch Generation', desc: 'Generate elevator pitches, one-minute pitches, and detailed presentations.' },
  { icon: 'rocket_launch', title: 'MVP Roadmaps', desc: 'Actionable 4-week MVP roadmaps tailored to your idea.' },
]

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, mounted, router])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-display-lg text-headline-md text-on-surface">Validator Pro</h1>
          <p className="text-label-sm text-on-surface-variant">AI Research Mode</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Sign In</Link>
          <Link href="/signup"
            className="bg-on-surface text-surface px-5 py-2.5 rounded-full font-label-md hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </header>

      <section className="px-6 md:px-12 pt-20 pb-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-label-sm text-tertiary uppercase tracking-widest mb-4">AI Startup Validator</p>
          <h2 className="font-display-xl text-display-xl text-on-surface leading-[1.05] tracking-[-0.04em] mb-6">
            Validate your startup idea<br />before you build it.
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mb-10">
            Analyze market demand, competition, SWOT, revenue models, and success probability — all powered by AI. Make data-driven decisions in minutes, not weeks.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/signup"
              className="bg-on-surface text-surface px-8 py-3.5 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity">
              Start Validating
            </Link>
            <Link href="/login"
              className="text-label-md text-on-surface-variant hover:text-on-surface px-6 py-3.5 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 hover:shadow-sm transition-shadow">
              <span className="material-symbols-outlined text-3xl text-tertiary mb-4">{f.icon}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{f.title}</h3>
              <p className="text-body-md text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-on-surface text-surface px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display-lg text-display-lg mb-4">Ready to validate your idea?</h2>
          <p className="text-body-lg text-surface-variant mb-8 max-w-lg mx-auto">
            Join now and get instant AI-powered insights to make smarter startup decisions.
          </p>
          <Link href="/signup"
            className="inline-block bg-surface text-on-surface px-8 py-3.5 rounded-full font-label-md hover:opacity-90 transition-opacity">
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-label-sm text-on-surface-variant">Validator Pro — AI Research Mode</p>
          <p className="text-label-sm text-on-surface-variant">&copy; {new Date().getFullYear()} Validator Pro</p>
        </div>
      </footer>
    </div>
  )
}
