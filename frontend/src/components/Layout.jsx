import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/careers', label: 'Career Paths' },
  { path: '/foundation', label: 'Foundation' },
  { path: '/projects', label: 'Projects' },
  { path: '/ask', label: 'Ask Anything' },
  { path: '/dashboard', label: 'My Progress' }
]

function Layout() {
  const location = useLocation()
  const streak = useAppStore((state) => state.streak)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span>🚀</span>
            <span className="gradient-text">LearnPath AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-indigo-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {streak > 0 && (
              <span className="badge badge-warning animate-float">
                🔥 {streak} day streak
              </span>
            )}
            <Link to="/careers" className="btn btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          <p>LearnPath AI — Learn like a real engineer. Build like a pro.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
