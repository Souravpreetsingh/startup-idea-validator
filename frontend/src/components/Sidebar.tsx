'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/ideas', label: 'Ideas', icon: 'lightbulb' },
    { path: '/chat', label: 'AI Assistant', icon: 'smart_toy' },
    { path: '/teams', label: 'Teams', icon: 'groups' },
    { path: '/features', label: 'Launchpad', icon: 'rocket_launch' },
    { path: '/portfolio', label: 'Portfolio', icon: 'folder_special' },
  ]

  return (
    <nav className="hidden md:flex flex-col bg-surface-container-lowest h-screen w-64 rounded-r-xl border-r border-outline-variant gap-6 p-6 shrink-0 fixed left-0 top-0 z-40">
      <div className="cursor-pointer" onClick={() => router.push('/')}>
        <h1 className="font-display-lg text-headline-md text-on-surface">Validator Pro</h1>
        <p className="text-label-sm text-on-surface-variant">AI Research Mode</p>
      </div>

      <button
        onClick={() => router.push('/ideas/new')}
        className="bg-tertiary-fixed text-on-tertiary-fixed rounded-full px-6 py-3 font-label-md hover:bg-tertiary-fixed-dim transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        New Analysis
      </button>

      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 text-label-md transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="border-t border-outline-variant pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-sm font-bold text-on-tertiary-fixed">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-sm text-on-surface truncate">{user?.fullName || 'User'}</p>
            <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-label-sm text-on-surface-variant hover:text-on-surface px-2 py-1 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
