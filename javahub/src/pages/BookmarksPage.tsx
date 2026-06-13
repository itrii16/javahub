import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { allCards, topicMap } from '@/content'
import { buildMarkdownExport, downloadMarkdown } from '@/lib/exportNotes'

export default function BookmarksPage() {
  const bookmarks = useAppStore(s => s.bookmarks)
  const toggleBookmark = useAppStore(s => s.toggleBookmark)
  const notes = useAppStore(s => s.notes)

  const bookmarkedCards = useMemo(
    () => bookmarks.map(id => allCards.find(c => c.id === id)).filter(Boolean),
    [bookmarks]
  )

  const noteCards = useMemo(
    () => Object.entries(notes)
      .filter(([, note]) => note.trim())
      .map(([cardId, note]) => ({
        card: allCards.find(c => c.id === cardId),
        note,
        preview: note.trim().slice(0, 100),
      }))
      .filter(x => x.card),
    [notes]
  )

  const handleExport = () => {
    const content = buildMarkdownExport(notes, cardId => {
      const card = allCards.find(c => c.id === cardId)
      if (!card) return null
      const topic = topicMap[card.topicId]
      return { title: card.title, topicId: topic?.title ?? card.topicId }
    })
    downloadMarkdown(content)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Bookmarks & Notes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} · {noteCards.length} note{noteCards.length !== 1 ? 's' : ''}
          </p>
        </div>
        {noteCards.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-indigo-300 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export notes (.md)
          </button>
        )}
      </div>

      {/* Bookmarked cards */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Bookmarked Cards</h2>
        {bookmarkedCards.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-10 text-center">
            <p className="text-gray-500 text-sm">No bookmarks yet</p>
            <p className="text-gray-600 text-xs mt-1">Star a card to save it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedCards.map(card => {
              if (!card) return null
              const topic = topicMap[card.topicId]
              return (
                <div key={card.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-600 mb-0.5">{topic?.title}</p>
                      <Link
                        to={`/topic/${card.topicId}/card/${card.id}`}
                        className="text-sm font-medium text-gray-200 hover:text-indigo-300 transition-colors"
                      >
                        {card.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => toggleBookmark(card.id)}
                      className="text-yellow-400 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
                      title="Remove bookmark"
                    >
                      ★
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{card.explanation}</p>
                  <div className="flex items-center gap-2 mt-auto pt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      card.difficulty === 'Beginner' ? 'text-green-400 bg-green-900/20' :
                      card.difficulty === 'Mid' ? 'text-yellow-400 bg-yellow-900/20' :
                      'text-red-400 bg-red-900/20'
                    }`}>{card.difficulty}</span>
                    <Link
                      to={`/topic/${card.topicId}/card/${card.id}`}
                      className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Notes</h2>
        {noteCards.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-10 text-center">
            <p className="text-gray-500 text-sm">No notes yet</p>
            <p className="text-gray-600 text-xs mt-1">Add notes on any card to capture your thoughts</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {noteCards.map(({ card, preview }) => {
              if (!card) return null
              const topic = topicMap[card.topicId]
              return (
                <Link
                  key={card.id}
                  to={`/topic/${card.topicId}/card/${card.id}`}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-200 truncate">{card.title}</span>
                      {topic && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded flex-shrink-0">{topic.title}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{preview}{preview.length >= 100 ? '…' : ''}</p>
                  </div>
                  <span className="text-xs text-gray-600 hover:text-gray-400 flex-shrink-0">Edit →</span>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
