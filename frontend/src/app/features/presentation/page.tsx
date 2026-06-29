'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { presentationService, type Presentation, type Slide } from '@/services/presentationService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function PresentationPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const slidesRef = useRef<HTMLDivElement>(null)

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
    setPresentation(null)
    setCurrentSlide(0)
    try {
      const res = await presentationService.generate(selectedIdea)
      setPresentation(res.data.presentation)
    } catch {
      toast.error('Failed to generate presentation')
    }
    setGenerating(false)
  }

  async function handleExport(format: 'pdf' | 'html') {
    if (!selectedIdea) return
    try {
      if (format === 'pdf') await presentationService.exportPdf(selectedIdea)
      else await presentationService.exportHtml(selectedIdea)
      toast.success(`${format.toUpperCase()} exported`)
    } catch {
      toast.error('Export failed')
    }
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">AI Tool</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Presentation Generator</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">Generate investor-ready pitch decks with AI.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <label className="font-label-sm text-on-surface mb-3 block">Select a startup idea</label>
            <div className="flex gap-3 flex-wrap">
              <select value={selectedIdea} onChange={(e) => setSelectedIdea(e.target.value)}
                className="flex-1 min-w-[200px] bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-on-surface">
                <option value="">Choose an idea...</option>
                {ideas.map((idea) => (
                  <option key={idea._id} value={idea._id}>{idea.title}</option>
                ))}
              </select>
              <button onClick={handleGenerate} disabled={!selectedIdea || generating}
                className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
                {generating ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                Generate
              </button>
              {presentation && (
                <>
                  <button onClick={() => handleExport('pdf')}
                    className="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 rounded-full font-label-md hover:bg-tertiary-fixed-dim transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                    PDF
                  </button>
                  <button onClick={() => handleExport('html')}
                    className="bg-surface-container-low text-on-surface px-5 py-2.5 rounded-full font-label-md hover:bg-surface-container-lowest transition-colors flex items-center gap-2 border border-outline-variant">
                    <span className="material-symbols-outlined text-lg">code</span>
                    HTML
                  </button>
                </>
              )}
            </div>
          </div>

          {generating && <div className="bg-surface-variant animate-pulse rounded-[32px] h-[400px]" />}

          {presentation && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {presentation.slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-on-surface' : 'bg-outline'}`} />
                  ))}
                </div>
                <p className="text-label-sm text-on-surface-variant">{currentSlide + 1} / {presentation.slides.length}</p>
              </div>

              <div ref={slidesRef} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 md:p-12 min-h-[500px] flex flex-col justify-center">
                <SlideView slide={presentation.slides[currentSlide]} total={presentation.slides.length} />
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))} disabled={currentSlide === 0}
                  className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors">
                  <span className="material-symbols-outlined">arrow_back</span> Previous
                </button>
                <button onClick={() => setCurrentSlide((p) => Math.min(presentation.slides.length - 1, p + 1))} disabled={currentSlide === presentation.slides.length - 1}
                  className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors">
                  Next <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </>
          )}

          {!loading && !presentation && !generating && (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">slideshow</span>
              <p className="text-on-surface-variant">Select an idea and generate a pitch presentation</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}

function SlideView({ slide, total }: { slide: Slide; total: number }) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-6">Slide {total > 0 ? `• ${total} slides` : ''}</p>
      <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] leading-[1.15] tracking-[-0.02em] font-medium text-on-surface mb-6">
        {slide.title}
      </h2>
      <p className="text-body-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl">{slide.content}</p>
      <ul className="space-y-3">
        {slide.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-body-md text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      {slide.notes && (
        <div className="mt-8 p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-1">Speaker Notes</p>
          <p className="text-body-sm text-on-surface-variant italic">{slide.notes}</p>
        </div>
      )}
    </div>
  )
}
