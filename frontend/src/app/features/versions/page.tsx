'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ideaService } from '@/services/ideaService'
import { versionService, type IdeaVersion } from '@/services/versionService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function VersionsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState('')
  const [versions, setVersions] = useState<IdeaVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingVersions, setLoadingVersions] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<IdeaVersion | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!selectedIdea) { setVersions([]); return }
    setLoadingVersions(true)
    versionService.list(selectedIdea).then((r) => setVersions(r.data.versions || [])).catch(() => {}).finally(() => setLoadingVersions(false))
  }, [selectedIdea])

  async function handleSave() {
    if (!selectedIdea) return
    setSaving(true)
    try {
      const res = await versionService.create(selectedIdea)
      setVersions((prev) => [res.data.version, ...prev])
      toast.success(`Version ${res.data.version.version} saved`)
    } catch {
      toast.error('Failed to save version')
    }
    setSaving(false)
  }

  async function handleRestore(version: number) {
    if (!confirm(`Restore idea to version ${version}? Current state will be saved as a new version.`)) return
    try {
      await versionService.restore(selectedIdea, version)
      toast.success(`Restored to version ${version}`)
      const res = await versionService.list(selectedIdea)
      setVersions(res.data.versions || [])
    } catch {
      toast.error('Failed to restore')
    }
  }

  function viewVersion(v: IdeaVersion) {
    setSelectedVersion(v)
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">History</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Idea Versioning</h2>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="font-label-sm text-on-surface mb-3 block">Select idea</label>
                <select value={selectedIdea} onChange={(e) => { setSelectedIdea(e.target.value); setSelectedVersion(null) }}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-on-surface">
                  <option value="">Choose an idea...</option>
                  {ideas.map((idea) => (
                    <option key={idea._id} value={idea._id}>{idea.title}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleSave} disabled={!selectedIdea || saving}
                className="bg-on-surface text-surface px-5 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">save</span>
                {saving ? 'Saving...' : 'Save Version'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-4">Version History</h3>
              {loadingVersions ? (
                <div className="bg-surface-variant animate-pulse rounded-[32px] h-[300px]" />
              ) : versions.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
                  <span className="material-symbols-outlined text-4xl text-outline mb-3">history</span>
                  <p className="text-on-surface-variant text-sm">No versions saved yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <button key={v._id} onClick={() => viewVersion(v)}
                      className={`w-full text-left bg-surface-container-lowest border border-outline-variant rounded-2xl px-4 py-3 hover:bg-surface-container-low transition-colors ${selectedVersion?._id === v._id ? 'ring-2 ring-tertiary' : ''}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-label-sm text-on-surface">v{v.version}</p>
                        <p className="text-[11px] text-on-surface-variant">{new Date(v.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">{v.changes.length} change{v.changes.length !== 1 ? 's' : ''}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedVersion && (
              <div>
                <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-4">
                  v{selectedVersion.version} Changes
                </h3>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {selectedVersion.changes.map((change, i) => (
                      <div key={i} className="bg-surface-container-low rounded-2xl p-3">
                        <p className="font-label-sm text-on-surface capitalize mb-2">{change.field.replace(/([A-Z])/g, ' $1')}</p>
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                          <div>
                            <p className="text-on-surface-variant mb-1">Before</p>
                            <p className="text-red-700 bg-red-50 rounded px-2 py-1">{String(change.oldValue ?? '(empty)')}</p>
                          </div>
                          <div>
                            <p className="text-on-surface-variant mb-1">After</p>
                            <p className="text-green-700 bg-green-50 rounded px-2 py-1">{String(change.newValue ?? '(empty)')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handleRestore(selectedVersion.version)}
                    className="mt-4 w-full bg-on-surface text-surface px-4 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors">
                    Restore v{selectedVersion.version}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
