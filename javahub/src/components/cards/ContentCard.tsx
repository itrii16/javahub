import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import { useAppStore } from '@/store/useAppStore'
import type { ContentCard as ContentCardType } from '@/types'

const DIFFICULTY_STYLES = {
  Beginner: 'text-green-400 bg-green-400/8 border-green-400/15',
  Mid: 'text-yellow-400 bg-yellow-400/8 border-yellow-400/15',
  Senior: 'text-red-400 bg-red-400/8 border-red-400/15',
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-colors ${filled ? 'text-indigo-400' : 'text-gray-600 hover:text-gray-400'}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  )
}

interface Props {
  card: ContentCardType
  compact?: boolean
}

export default function ContentCard({ card, compact = false }: Props) {
  const codeRef = useRef<HTMLElement>(null)
  const toggleBookmark = useAppStore(s => s.toggleBookmark)
  const isBookmarked = useAppStore(s => s.isBookmarked(card.id))
  const note = useAppStore(s => s.getNote(card.id))
  const setNote = useAppStore(s => s.setNote)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [card.codeExample])

  return (
    <article className="bg-gray-900 border border-gray-800/80 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className="text-[11px] text-gray-600">{card.subtopicId}</span>
          </div>
          <h2 className="text-base font-semibold text-gray-100 leading-snug">{card.title}</h2>
        </div>
        <button
          onClick={() => toggleBookmark(card.id)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark card'}
          className="flex-shrink-0 mt-0.5 transition-colors"
        >
          <BookmarkIcon filled={isBookmarked} />
        </button>
      </div>

      {/* Explanation */}
      <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">
        {card.explanation}
      </p>

      {/* Code example */}
      {card.codeExample && (
        <div className="mx-5 mb-4 rounded-lg overflow-hidden border border-gray-800">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-800/60 border-b border-gray-800">
            <span className="text-[11px] text-gray-500 font-mono uppercase tracking-wider">Java</span>
            {card.tryItUrl && (
              <a
                href={card.tryItUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Try it ↗
              </a>
            )}
          </div>
          <pre className="overflow-x-auto text-xs p-4 bg-gray-950 m-0">
            <code ref={codeRef} className="language-java">
              {card.codeExample}
            </code>
          </pre>
        </div>
      )}

      {/* Why it matters */}
      <div className="mx-5 mb-3 px-4 py-3 rounded-lg bg-indigo-500/5 border border-indigo-500/15">
        <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.06em] mb-1">Why it matters</p>
        <p className="text-sm text-gray-400">{card.whyItMatters}</p>
      </div>

      {/* Gotcha */}
      <div className="mx-5 mb-4 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
        <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-[0.06em] mb-1">Common gotcha</p>
        <p className="text-sm text-gray-400">{card.gotcha}</p>
      </div>

      {/* Complexity table */}
      {!compact && card.complexityTable && card.complexityTable.length > 0 && (
        <div className="mx-5 mb-4">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.06em] mb-2">Complexity</p>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-xs">
              <thead className="bg-gray-800/60 text-gray-500">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Operation</th>
                  <th className="px-3 py-2 font-medium">Best</th>
                  <th className="px-3 py-2 font-medium">Average</th>
                  <th className="px-3 py-2 font-medium">Worst</th>
                  {card.complexityTable.some(r => r.space) && (
                    <th className="px-3 py-2 font-medium">Space</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {card.complexityTable.map(row => (
                  <tr key={row.operation} className="border-t border-gray-800">
                    <td className="px-3 py-2 font-medium text-gray-300">{row.operation}</td>
                    <td className="px-3 py-2 text-center font-mono">{row.best}</td>
                    <td className="px-3 py-2 text-center font-mono">{row.average}</td>
                    <td className="px-3 py-2 text-center font-mono">{row.worst}</td>
                    {row.space && <td className="px-3 py-2 text-center font-mono">{row.space}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VS comparison */}
      {!compact && card.vsComparison && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-lg bg-gray-800/40 border border-gray-800">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.06em] mb-1">When to use</p>
          <p className="text-sm text-gray-400">{card.vsComparison}</p>
        </div>
      )}

      {/* JDK class */}
      {card.jdkClass && (
        <div className="px-5 mb-4">
          <span className="text-xs text-gray-600">JDK class: </span>
          <code className="text-xs text-indigo-300 font-mono">{card.jdkClass}</code>
        </div>
      )}

      {/* Notes */}
      {!compact && (
        <div className="px-5 pb-5">
          <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-[0.06em] mb-2">
            Notes
          </label>
          <textarea
            value={note}
            onChange={e => setNote(card.id, e.target.value)}
            placeholder="Add your notes here..."
            rows={3}
            className="w-full text-sm bg-gray-800/50 border border-gray-800 rounded-lg px-3 py-2.5 text-gray-300 placeholder-gray-700 focus:outline-none focus:border-gray-600 resize-y transition-colors"
          />
        </div>
      )}
    </article>
  )
}
