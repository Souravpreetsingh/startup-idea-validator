'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useIdeas } from '@/hooks/useIdea'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function NewIdeaPage() {
  const { user, loading: authLoading } = useAuth()
  const { createIdea } = useIdeas()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', industry: '', targetAudience: '',
    budget: '', businessModel: '', problemStatement: '', expectedSolution: '',
  })

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const idea = await createIdea(form)
    setSubmitting(false)
    if (idea) router.push(`/analysis/${idea._id}`)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const idea = res.data.data.idea
      toast.success('Pitch uploaded and analyzed!')
      router.push(`/analysis/${idea._id}`)
    } catch {
      toast.error('Upload failed. Try PDF or DOCX.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const fields = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Decentralized Personal Data Vault', required: true },
    { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. SaaS, Fintech, HealthTech', required: true },
    { key: 'targetAudience', label: 'Target Audience', type: 'text', placeholder: 'Who are your ideal customers?' },
    { key: 'budget', label: 'Budget', type: 'text', placeholder: 'Estimated initial budget' },
    { key: 'businessModel', label: 'Business Model', type: 'text', placeholder: 'e.g. Subscription, Marketplace' },
  ]

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-2">New Startup Idea</h2>
          <p className="text-on-surface-variant mb-6">Fill in the details or upload a pitch deck.</p>

          {/* File Upload */}
          <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-[32px] p-8 mb-8 text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-3">upload_file</span>
            <h3 className="font-label-md text-on-surface mb-1">Upload Pitch Deck</h3>
            <p className="text-sm text-on-surface-variant mb-4">PDF or DOCX — AI will extract and analyze</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-tertiary-fixed text-on-tertiary-fixed px-6 py-3 rounded-full font-label-md hover:bg-tertiary-fixed-dim transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {uploading ? (
                <><span className="w-4 h-4 border-2 border-on-tertiary-fixed border-t-transparent rounded-full animate-spin" /> Processing...</>
              ) : (
                <><span className="material-symbols-outlined">description</span> Choose File</>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Or fill manually</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 space-y-6">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                    {f.label} {f.required && <span className="text-error">*</span>}
                  </label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={update(f.key)} required={f.required}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-on-surface transition-colors" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Description <span className="text-error">*</span></label>
                <textarea value={form.description} onChange={update('description')} required minLength={10} rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-on-surface transition-colors resize-none" placeholder="Describe your startup idea in detail..." />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Problem Statement</label>
                <textarea value={form.problemStatement} onChange={update('problemStatement')} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-on-surface transition-colors resize-none" placeholder="What problem does your startup solve?" />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Expected Solution</label>
                <textarea value={form.expectedSolution} onChange={update('expectedSolution')} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-on-surface transition-colors resize-none" placeholder="How does your solution work?" />
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-on-surface text-surface py-4 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg">
              {submitting ? <><span className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin" /> Creating...</> : <><span className="material-symbols-outlined">auto_awesome</span> Analyze with AI</>}
            </button>
          </form>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
