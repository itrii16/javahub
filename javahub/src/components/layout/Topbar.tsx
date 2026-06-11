import { Link } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'

export default function Topbar() {
  const streak = useAppStore(s => s.streak)

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
      <Link to="/" className="flex items-center gap-2 text-indigo-400 font-semibold text-lg hover:text-indigo-300 transition-colors">
        <span className="text-xl">☕</span>
        <span>JavaHub</span>
      </Link>
      {streak.count > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <span className="text-orange-400">🔥</span>
          <span>{streak.count} day streak</span>
        </div>
      )}
    </header>
  )
}
