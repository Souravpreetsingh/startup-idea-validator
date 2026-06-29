import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/chat', label: 'AI Assistant', icon: 'smart_toy' },
  { path: '/analysis', label: 'Analyze', icon: 'analytics' },
  { path: '/', label: 'Profile', icon: 'person' },
]

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface/80 backdrop-blur-md border-t border-outline-variant z-50 px-6 py-3 flex justify-between items-center">
      {items.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <span
              className="material-symbols-outlined"
              {...(isActive ? { style: { fontVariationSettings: "'FILL' 1" } } : {})}
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
