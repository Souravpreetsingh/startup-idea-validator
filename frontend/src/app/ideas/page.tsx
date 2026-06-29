'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useIdeas } from '@/hooks/useIdea'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import { ListSkeleton } from '@/components/LoadingSkeleton'

export default function IdeasPage() {
  const { user, loading: authLoading } = useAuth()
  const { ideas, loading, fetchIdeas } = useIdeas()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) fetchIdeas()
  }, [user, fetchIdeas])

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-8 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <h2 className="font-display-lg text-display-lg text-on-surface">My Ideas</h2>
            <button
              onClick={() => router.push('/ideas/new')}
              className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors"
            >
              New Idea
            </button>
          </div>

          {loading ? (
            <ListSkeleton />
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">lightbulb_outline</span>
              <p className="text-on-surface-variant text-lg mb-4">No startup ideas yet</p>
              <button
                onClick={() => router.push('/ideas/new')}
                className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant"
              >
                Create Your First Idea
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  onClick={() => router.push(`/analysis/${idea._id}`)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-label-md text-on-surface text-lg mb-1">{idea.title}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2">{idea.description}</p>
                      {idea.businessModel && (
                        <span className="inline-block mt-2 text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded">{idea.businessModel}</span>
                      )}
                    </div>
                    <span className="text-label-sm text-on-surface-variant bg-surface-variant px-3 py-1.5 rounded-full shrink-0">{idea.industry}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
