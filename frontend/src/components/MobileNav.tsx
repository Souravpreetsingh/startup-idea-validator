'use client'

import { usePathname, useRouter } from 'next/navigation'

const items = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/ideas', label: 'Ideas', icon: 'lightbulb' },
  { path: '/chat', label: 'AI', icon: 'smart_toy' },
  { path: '/features', label: 'Tools', icon: 'rocket_launch' },
  { path: '/teams', label: 'Teams', icon: 'groups' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface/80 backdrop-blur-md border-t border-outline-variant z-50 px-6 py-3 flex justify-between items-center">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.path)
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <span
              className="material-symbols-outlined"
              {...(isActive ? { style: { fontVariationSettings: "'FILL' 1" } as React.CSSProperties } : {})}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
