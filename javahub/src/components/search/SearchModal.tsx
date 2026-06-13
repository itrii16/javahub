import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { topics } from '@/content'
import { search, type SearchResult } from '@/lib/searchIndex'

interface Props {
  index: SearchResult[]
  onClose: () => void
}

const TYPE_LABEL: Record<SearchResult['type'], string> = {
  'card': 'Content Cards',
  'cheatsheet': 'Cheat Sheets',
  'interview-qa': 'Interview Q&As',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-900/20',
  Mid: 'text-yellow-400 bg-yellow-900/20',
  Senior: 'text-red-400 bg-red-900/20',
}

export default function SearchModal({ index, onClose }: Props) {
  const navigate = useNavigate()
  const searchHistory = useAppStore(s => s.searchHistory)
  const addSearchHistory = useAppStore(s => s.addSearchHistory)
  const clearSearchHistory = useAppStore(s => s.clearSearchHistory)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [filterTopic, setFilterTopic] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterType, setFilterType] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => { setSelectedIdx(0) }, [debouncedQuery])

  const results = useMemo(
    () => search(debouncedQuery, index, {
      topicId: filterTopic || undefined,
      difficulty: filterDifficulty || undefined,
      type: filterType || undefined,
    }),
    [debouncedQuery, index, filterTopic, filterDifficulty, filterType]
  )

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Partial<Record<SearchResult['type'], SearchResult[]>> = {}
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = []
      groups[r.type]!.push(r)
    }
    return groups
  }, [results])

  const flatResults = results

  const navigateTo = (result: SearchResult) => {
    if (debouncedQuery.trim()) addSearchHistory(debouncedQuery.trim())
    onClose()
    navigate(result.url)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, flatResults.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && flatResults[selectedIdx]) navigateTo(flatResults[selectedIdx])
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center pt-[10vh]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl mx-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search cards, cheat sheets, Q&As…"
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-600 text-sm outline-none"
          />
          <kbd className="hidden sm:block text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded border border-gray-700">ESC</kbd>
        </div>

        {/* Filters — shown when results exist */}
        {results.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 overflow-x-auto">
            <select
              value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)}
              className="text-xs bg-gray-800 text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none"
            >
              <option value="">All topics</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="text-xs bg-gray-800 text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none"
            >
              <option value="">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs bg-gray-800 text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none"
            >
              <option value="">All types</option>
              <option value="card">Cards</option>
              <option value="cheatsheet">Cheat Sheets</option>
              <option value="interview-qa">Q&As</option>
            </select>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* Recent searches (when query is empty) */}
          {!debouncedQuery && searchHistory.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Recent</p>
                <button onClick={clearSearchHistory} className="text-[10px] text-gray-600 hover:text-gray-400">Clear</button>
              </div>
              {searchHistory.map(h => (
                <button
                  key={h}
                  onClick={() => setQuery(h)}
                  className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <svg className="w-3 h-3 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex-1 truncate">{h}</span>
                </button>
              ))}
            </div>
          )}

          {/* No query + no history */}
          {!debouncedQuery && searchHistory.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-600 text-sm">
              <p>Search across all cards, cheat sheets, and interview Q&As</p>
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {['HashMap', 'Singleton', 'try-with-resources', 'Redis', 'rate limiting'].map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-full transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {debouncedQuery && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-600">
              No results for "<span className="text-gray-400">{debouncedQuery}</span>"
            </div>
          )}

          {/* Results grouped by type */}
          {Object.entries(grouped).map(([type, items]) => {
            if (!items) return null
            let flatOffset = 0
            for (const [t, its] of Object.entries(grouped)) {
              if (t === type) break
              flatOffset += its?.length ?? 0
            }
            return (
              <div key={type}>
                <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                  {TYPE_LABEL[type as SearchResult['type']]} ({items.length})
                </p>
                {items.map((result, i) => {
                  const idx = flatOffset + i
                  const isSelected = idx === selectedIdx
                  return (
                    <button
                      key={result.id}
                      onClick={() => navigateTo(result)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`w-full text-left px-4 py-2.5 transition-colors border-l-2 ${
                        isSelected ? 'bg-gray-800 border-indigo-500' : 'border-transparent hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm text-gray-100 font-medium truncate flex-1">{result.title}</span>
                        {result.difficulty && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${DIFFICULTY_COLOR[result.difficulty] ?? ''}`}>
                            {result.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{result.snippet}</p>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-800 flex items-center gap-3 text-[10px] text-gray-600">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span className="ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  )
}
