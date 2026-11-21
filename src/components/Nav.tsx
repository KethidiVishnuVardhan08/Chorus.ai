import { Link, useLocation } from 'react-router-dom'
import { BarChart2, MessageCircle, Sun, FlaskConical, Home } from 'lucide-react'
import { motion } from 'framer-motion'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  { to: '/ask', label: 'Ask Feedback', icon: MessageCircle },
  { to: '/digest', label: 'Daily Digest', icon: Sun },
  { to: '/evals', label: 'Evals', icon: FlaskConical },
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        background: 'rgba(243, 234, 222, 0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(217, 195, 176, 0.5)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2A1D16 0%, #4A3426 100%)' }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: '#D98B82' }} />
          </div>
          <span className="heading-md text-base" style={{ color: '#1A1512' }}>
            Chorus<span style={{ color: '#D98B82' }}>.ai</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`nav-link flex items-center gap-1.5 ${pathname === '/' ? 'active' : ''}`}
          >
            <Home size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link flex items-center gap-1.5 ${pathname === to ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
              {pathname === to && (
                <motion.span
                  layoutId="nav-indicator"
                  className="sr-only"
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
