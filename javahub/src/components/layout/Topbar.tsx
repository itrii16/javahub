import { Link } from 'react-router-dom'
import SearchTrigger from '@/components/search/SearchTrigger'

interface Props {
  onMenuClick: () => void
  onSearchClick: () => void
}

export default function Topbar({ onMenuClick, onSearchClick }: Props) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-12 bg-gray-950 border-b border-gray-800/60 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        <Link
          to="/"
          className="font-semibold text-sm tracking-tight text-gray-100 hover:text-white transition-colors"
        >
          JavaHub
        </Link>
      </div>

      <SearchTrigger onClick={onSearchClick} />
    </header>
  )
}
