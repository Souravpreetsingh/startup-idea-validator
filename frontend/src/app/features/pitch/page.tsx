'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { pitchService, type Pitch } from '@/services/pitchService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function PitchPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [pitch, setPitch] = useState<Pitch | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).finally(() => setLoading(false))
  }, [user])

  async function handleGenerate() {
    if (!selectedIdea) return
    setGenerating(true)
    setPitch(null)
    try {
      const res = await pitchService.generate(selectedIdea)
      setPitch(res.data.pitch)
    } catch {
      toast.error('Failed to generate pitch')
    }
    setGenerating(false)
  }

  async function handleCopy() {
    if (!pitch) return
    const text = Object.values(pitch).join('\n\n')
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">AI Tool</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Pitch Generator</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">Generate a compelling investor pitch deck from your startup analysis.</p>
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
              <button onClick={handleGenerate} disabled={!selectedIdea || generating}
                className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
                {generating ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                Generate Pitch
              </button>
            </div>
          </div>

          {generating && <div className="bg-surface-variant animate-pulse rounded-[32px] h-[200px]" />}

          {pitch && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={handleCopy}
                  className="text-label-sm text-tertiary hover:text-on-surface transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy All
                </button>
              </div>
              {[
                { label: 'Executive Summary', key: 'executiveSummary' },
                { label: 'Problem Statement', key: 'problemStatement' },
                { label: 'Solution', key: 'solution' },
                { label: 'Market Opportunity', key: 'marketOpportunity' },
                { label: 'Business Model', key: 'businessModel' },
                { label: 'Traction', key: 'traction' },
                { label: 'The Ask', key: 'ask' },
                { label: 'Mission', key: 'mission' },
              ].map(({ label, key }) => (
                <div key={key} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h3 className="font-label-md text-on-surface mb-3">{label}</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap">{pitch[key as keyof Pitch]}</p>
                </div>
              ))}
            </div>
          )}

          {!loading && !pitch && !generating && (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">campaign</span>
              <p className="text-on-surface-variant">Select an idea and generate a pitch deck</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
