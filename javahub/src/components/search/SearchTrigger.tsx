interface Props {
  onClick: () => void
}

export default function SearchTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-500 hover:text-gray-300 transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <span className="hidden sm:inline text-xs">Search…</span>
      <kbd className="hidden sm:block text-[10px] px-1 py-0.5 bg-gray-700 rounded border border-gray-600">⌘K</kbd>
    </button>
  )
}
