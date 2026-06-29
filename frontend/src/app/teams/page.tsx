'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { teamService, type Team } from '@/services/teamService'
import { ideaService } from '@/services/ideaService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

export default function TeamsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitingTeam, setInvitingTeam] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([
      teamService.list().then((r) => setTeams(r.data?.teams || [])).catch(() => {}),
      ideaService.getIdeas(1, 100).then((r) => setIdeas(r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [user])

  async function handleCreate() {
    if (!teamName.trim()) return
    try {
      const res = await teamService.create(teamName.trim())
      setTeams((prev) => [...prev, res.data.team])
      setTeamName('')
      setShowCreate(false)
      toast.success('Team created')
    } catch { toast.error('Failed to create team') }
  }

  async function handleInvite(teamId: string) {
    if (!inviteEmail.trim()) return
    try {
      await teamService.invite(teamId, inviteEmail.trim())
      setInviteEmail('')
      setInvitingTeam(null)
      toast.success('Invite sent')
    } catch { toast.error('Failed to send invite') }
  }

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Collaboration</p>
              <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Teams</h2>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="bg-on-surface text-surface px-5 py-2.5 rounded-full font-label-md hover:bg-on-surface-variant transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">group_add</span>
              New Team
            </button>
          </div>

          {showCreate && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
              <h3 className="font-label-md text-on-surface mb-4">Create Team</h3>
              <div className="flex gap-3">
                <input value={teamName} onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team name" className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:border-on-surface" />
                <button onClick={handleCreate}
                  className="bg-on-surface text-surface px-5 py-2 rounded-full font-label-md hover:bg-on-surface-variant transition-colors">Create</button>
                <button onClick={() => setShowCreate(false)}
                  className="text-on-surface-variant px-3 py-2 hover:text-on-surface transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-variant animate-pulse rounded-[32px] h-[200px]" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">groups</span>
              <p className="text-on-surface-variant text-lg mb-2">No teams yet</p>
              <p className="text-sm text-on-surface-variant mb-6">Create a team to collaborate with co-founders.</p>
              <button onClick={() => setShowCreate(true)}
                className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors">Create Team</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div key={team._id} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-label-md text-on-surface mb-1">{team.name}</h3>
                      <p className="text-body-sm text-on-surface-variant">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">groups</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.members.map((m, i) => (
                      <span key={i} className="bg-surface-container-low text-on-surface-variant text-[11px] px-2 py-1 rounded-full capitalize">
                        {m.role}
                      </span>
                    ))}
                  </div>

                  {invitingTeam === team._id ? (
                    <div className="flex gap-2">
                      <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Email to invite" type="email"
                        className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-3 py-1.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-on-surface" />
                      <button onClick={() => handleInvite(team._id)}
                        className="bg-on-surface text-surface px-4 py-1.5 rounded-full text-[13px] font-label-md hover:bg-on-surface-variant transition-colors">Send</button>
                      <button onClick={() => { setInvitingTeam(null); setInviteEmail('') }}
                        className="text-on-surface-variant px-2 text-[13px]">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setInvitingTeam(team._id)}
                      className="text-label-sm text-tertiary hover:text-on-surface transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      Invite member
                    </button>
                  )}
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
