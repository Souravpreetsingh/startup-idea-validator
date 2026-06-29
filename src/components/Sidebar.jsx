import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/chat', label: 'AI Assistant', icon: 'smart_toy' },
  ]

  return (
    <nav className="hidden md:flex flex-col bg-surface-container-lowest h-screen w-64 rounded-r-xl border-r border-outline-variant gap-stack-md p-stack-md shrink-0 fixed left-0 top-0 z-40">
      <div className="mb-stack-lg">
        <h1 className="font-display-lg text-headline-md text-on-surface cursor-pointer" onClick={() => navigate('/')}>Validator Pro</h1>
        <p className="font-body-md text-label-sm text-on-surface-variant">AI Research Mode</p>
      </div>
      <button
        onClick={() => navigate('/analysis')}
        className="bg-tertiary-fixed text-on-tertiary-fixed rounded-full px-6 py-3 font-label-md hover:bg-tertiary-fixed-dim transition-colors mb-6 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        New Analysis
      </button>
      <div className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 font-body-md text-label-md transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
