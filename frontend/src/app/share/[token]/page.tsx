'use client'

import { useEffect, useState } from 'react'
import { shareService } from '@/services/shareService'
import { TextSkeleton } from '@/components/LoadingSkeleton'

interface SharedData {
  idea: {
    title: string
    description: string
    industry: string
    targetAudience?: string
    businessModel?: string
  }
  analysis: {
    ideaScore: number
    successProbability: number
    marketDemand: string
    competition: string
    competitors: Array<{ name: string; strengths: string; weaknesses: string }>
    swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }
    revenueSuggestions: string[]
    growthStrategy: string
    mvpRoadmap: string[]
    createdAt: string
  }
  sharedAt: string
}

export default function SharedAnalysisPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<SharedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    shareService.getShared(params.token)
      .then((r) => setData(r.data))
      .catch(() => setError('This shared analysis could not be found or has expired.'))
      .finally(() => setLoading(false))
  }, [params.token])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-3xl"><TextSkeleton lines={6} /></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">link_off</span>
          <h1 className="font-display-xl text-[32px] text-on-surface mb-2">Not Found</h1>
          <p className="text-on-surface-variant">{error || 'Analysis not available'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="text-center mb-8 pt-8">
          <h1 className="font-display-2xl text-[clamp(32px,5vw,64px)] leading-[1.05] tracking-[-0.04em] font-medium text-on-surface mb-2">
            {data.idea.title}
          </h1>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-widest">{data.idea.industry} Analysis</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ScoreCard label="Idea Score" value={`${data.analysis.ideaScore}/100`} />
          <ScoreCard label="Success Probability" value={`${data.analysis.successProbability}%`} />
          <ScoreCard label="Competitors" value={`${data.analysis.competitors.length}`} />
          <ScoreCard label="Market Demand" value={data.analysis.marketDemand} />
        </div>

        {data.idea.description && (
          <Section title="Description">
            <p className="text-body-md text-on-surface-variant leading-relaxed">{data.idea.description}</p>
          </Section>
        )}

        <Section title="SWOT Analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SwotBox title="Strengths" items={data.analysis.swot.strengths} color="green" />
            <SwotBox title="Weaknesses" items={data.analysis.swot.weaknesses} color="red" />
            <SwotBox title="Opportunities" items={data.analysis.swot.opportunities} color="blue" />
            <SwotBox title="Threats" items={data.analysis.swot.threats} color="orange" />
          </div>
        </Section>

        {data.analysis.competitors.length > 0 && (
          <Section title="Competitors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.analysis.competitors.map((c, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4">
                  <p className="font-label-sm text-on-surface mb-2">{c.name}</p>
                  <p className="text-[12px] text-on-surface-variant"><span className="font-medium">Strengths:</span> {c.strengths}</p>
                  <p className="text-[12px] text-on-surface-variant mt-1"><span className="font-medium">Weaknesses:</span> {c.weaknesses}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.analysis.mvpRoadmap.length > 0 && (
          <Section title="MVP Roadmap">
            <ol className="list-decimal list-inside space-y-1">
              {data.analysis.mvpRoadmap.map((step, i) => (
                <li key={i} className="text-body-sm text-on-surface-variant">{step}</li>
              ))}
            </ol>
          </Section>
        )}

        <div className="text-center text-[11px] text-on-surface-variant mt-12 mb-8">
          Shared via Validator Pro · {new Date(data.sharedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 text-center">
      <p className="text-label-sm text-on-surface-variant uppercase tracking-widest text-[11px] mb-1">{label}</p>
      <p className="font-display-md text-[clamp(18px,2vw,28px)] text-on-surface font-medium">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-label-md text-on-surface uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  )
}

function SwotBox({ title, items, color }: { title: string; items: string[]; color: string }) {
  const colors: Record<string, string> = {
    green: 'border-l-green-600 bg-green-50/50',
    red: 'border-l-red-600 bg-red-50/50',
    blue: 'border-l-blue-600 bg-blue-50/50',
    orange: 'border-l-orange-600 bg-orange-50/50',
  }
  return (
    <div className={`border-l-4 rounded-2xl p-4 ${colors[color] || ''}`}>
      <p className="font-label-sm text-on-surface mb-2">{title}</p>
      {items.length === 0 ? (
        <p className="text-[13px] text-on-surface-variant italic">None identified</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-[13px] text-on-surface-variant flex gap-2">
              <span>•</span>{item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
