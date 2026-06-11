import { Link } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const streak = useAppStore(s => s.streak)

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="md:hidden p-1 -ml-1 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2 text-indigo-400 font-semibold text-lg hover:text-indigo-300 transition-colors">
          <span className="text-xl">☕</span>
          <span>JavaHub</span>
        </Link>
      </div>

      {streak.count > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <span className="text-orange-400">🔥</span>
          <span>{streak.count} day streak</span>
        </div>
      )}
    </header>
  )
}
