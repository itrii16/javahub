import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import { useAppStore } from '@/store/useAppStore'
import type { ContentCard as ContentCardType } from '@/types'

const DIFFICULTY_STYLES = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  Mid: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Senior: 'text-red-400 bg-red-400/10 border-red-400/20',
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
    <article className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-4 md:px-5 pt-4 md:pt-5 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className="text-xs text-gray-500">{card.subtopicId}</span>
          </div>
          <h2 className="text-base font-semibold text-gray-100 leading-snug">{card.title}</h2>
        </div>
        <button
          onClick={() => toggleBookmark(card.id)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark card'}
          className={`flex-shrink-0 text-xl transition-colors ${
            isBookmarked ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
          }`}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      {/* Explanation */}
      <p className="px-4 md:px-5 pb-4 text-sm text-gray-300 leading-relaxed">
        {card.explanation}
      </p>

      {/* Code example */}
      {card.codeExample && (
        <div className="mx-3 md:mx-5 mb-4 rounded-lg overflow-hidden border border-gray-800">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
            <span className="text-xs text-gray-400 font-mono">Java</span>
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
          <pre className="overflow-x-auto text-xs md:text-sm p-3 md:p-4 bg-gray-950 m-0">
            <code ref={codeRef} className="language-java">
              {card.codeExample}
            </code>
          </pre>
        </div>
      )}

      {/* Why it matters */}
      <div className="mx-3 md:mx-5 mb-3 px-3 py-2 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
        <p className="text-xs font-semibold text-indigo-400 mb-0.5">Why it matters</p>
        <p className="text-sm text-gray-300">{card.whyItMatters}</p>
      </div>

      {/* Gotcha */}
      <div className="mx-3 md:mx-5 mb-4 px-3 py-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
        <p className="text-xs font-semibold text-yellow-400 mb-0.5">⚠ Common gotcha</p>
        <p className="text-sm text-gray-300">{card.gotcha}</p>
      </div>

      {/* Complexity table */}
      {!compact && card.complexityTable && card.complexityTable.length > 0 && (
        <div className="mx-3 md:mx-5 mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">Time & Space Complexity</p>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-xs">
              <thead className="bg-gray-800 text-gray-400">
                <tr>
                  <th className="text-left px-3 py-2">Operation</th>
                  <th className="px-3 py-2">Best</th>
                  <th className="px-3 py-2">Average</th>
                  <th className="px-3 py-2">Worst</th>
                  {card.complexityTable.some(r => r.space) && (
                    <th className="px-3 py-2">Space</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {card.complexityTable.map(row => (
                  <tr key={row.operation} className="border-t border-gray-800">
                    <td className="px-3 py-2 font-medium">{row.operation}</td>
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
        <div className="mx-3 md:mx-5 mb-4 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
          <p className="text-xs font-semibold text-gray-400 mb-0.5">When to use</p>
          <p className="text-sm text-gray-300">{card.vsComparison}</p>
        </div>
      )}

      {/* JDK class */}
      {card.jdkClass && (
        <div className="px-4 md:px-5 mb-4">
          <span className="text-xs text-gray-500">JDK class: </span>
          <code className="text-xs text-indigo-300 font-mono">{card.jdkClass}</code>
        </div>
      )}

      {/* Notes */}
      {!compact && (
        <div className="px-4 md:px-5 pb-4 md:pb-5">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            My notes (markdown)
          </label>
          <textarea
            value={note}
            onChange={e => setNote(card.id, e.target.value)}
            placeholder="Add your notes here..."
            rows={3}
            className="w-full text-sm bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
      )}
    </article>
  )
}
