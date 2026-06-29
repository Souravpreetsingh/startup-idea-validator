'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { badgeService, type Badge } from '@/services/badgeService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function BadgesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    badgeService.getBadges().then((r) => setBadges(r.data.badges || [])).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const res = await badgeService.refresh()
      setBadges(res.data.badges || [])
      if (res.data.newBadges?.length) {
        toast.success(`New badges: ${res.data.newBadges.join(', ')}`)
      } else {
        toast.success('No new badges')
      }
    } catch {
      toast.error('Failed to refresh badges')
    }
    setRefreshing(false)
  }

  if (authLoading || !user) return null

  const earned = badges.filter((b) => b.earned)
  const locked = badges.filter((b) => !b.earned)

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Gamification</p>
              <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Achievements</h2>
            </div>
            <button onClick={handleRefresh} disabled={refreshing}
              className="bg-on-surface text-surface px-5 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-40 flex items-center gap-2">
              <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface-variant animate-pulse rounded-[32px] h-[160px]" />
              ))}
            </div>
          ) : (
            <>
              {earned.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-4">Earned ({earned.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {earned.map((badge) => (
                      <div key={badge.id} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-tertiary mb-2">{badge.icon}</span>
                        <h4 className="font-label-sm text-on-surface mb-1">{badge.name}</h4>
                        <p className="text-[11px] text-on-surface-variant">{badge.description}</p>
                        {badge.earnedAt && (
                          <p className="text-[10px] text-on-surface-variant mt-2">Earned {new Date(badge.earnedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-4">Locked ({locked.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {locked.map((badge) => (
                    <div key={badge.id} className="bg-surface-container-low border border-outline-variant rounded-[32px] p-6 text-center opacity-50">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2">lock</span>
                      <h4 className="font-label-sm text-on-surface mb-1">{badge.name}</h4>
                      <p className="text-[11px] text-on-surface-variant">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
