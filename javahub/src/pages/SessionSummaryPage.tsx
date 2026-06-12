import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { topicMap } from '@/content'
import { useAppStore } from '@/store/useAppStore'

interface SessionResult {
  cardId: string
  quality: number
}

interface StoredSession {
  topicId: string
  results: SessionResult[]
  completedAt: string
}

const QUALITY_LABEL: Record<number, string> = {
  1: 'Blank',
  2: 'Wrong',
  3: 'Hard',
  4: 'Good',
  5: 'Perfect',
}

const QUALITY_COLOR: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-emerald-500',
}

export default function SessionSummaryPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const [session, setSession] = useState<StoredSession | null>(null)
  const getCardProgress = useAppStore(s => s.getCardProgress)

  useEffect(() => {
    const raw = sessionStorage.getItem('lastSessionResults')
    if (raw) {
      try {
        setSession(JSON.parse(raw))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const topic = topicId ? topicMap[topicId] : null
  const allTopicCards = topic ? topic.subtopics.flatMap(s => s.cards) : []

  if (!session || !topic) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 text-gray-400">
        <p className="mb-4">No session data found.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Home</Link>
      </div>
    )
  }

  const total = session.results.length
  const got = session.results.filter(r => r.quality >= 3).length
  const toReview = total - got

  const distribution = [1, 2, 3, 4, 5].map(q => ({
    q,
    count: session.results.filter(r => r.quality === q).length,
    label: QUALITY_LABEL[q],
    color: QUALITY_COLOR[q],
  }))
  const maxCount = Math.max(...distribution.map(d => d.count), 1)

  const reviewCards = session.results
    .filter(r => r.quality < 3)
    .map(r => ({
      result: r,
      card: allTopicCards.find(c => c.id === r.cardId),
    }))
    .filter(({ card }) => card !== undefined)

  const upcomingCards = session.results
    .filter(r => r.quality >= 3)
    .map(r => ({
      result: r,
      card: allTopicCards.find(c => c.id === r.cardId),
      progress: getCardProgress(r.cardId),
    }))
    .filter(({ card }) => card !== undefined)
    .sort((a, b) => a.progress.sm2.dueDate.localeCompare(b.progress.sm2.dueDate))
    .slice(0, 5)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">✅</p>
        <h1 className="text-2xl font-bold text-gray-100 mb-1">Session complete</h1>
        <p className="text-gray-400">{topic.title}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-100">{total}</p>
          <p className="text-xs text-gray-500 mt-1">Cards reviewed</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{got}</p>
          <p className="text-xs text-gray-500 mt-1">Got it</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{toReview}</p>
          <p className="text-xs text-gray-500 mt-1">To review</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Confidence distribution</h2>
        <div className="flex items-end gap-3 h-24">
          {distribution.map(d => (
            <div key={d.q} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{d.count}</span>
              <div
                className={`w-full rounded-t-md ${d.color} transition-all`}
                style={{ height: `${(d.count / maxCount) * 80}px`, minHeight: d.count > 0 ? '4px' : '0' }}
              />
              <span className="text-xs text-gray-500">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {reviewCards.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-yellow-400 mb-3">
            ↺ Review these cards ({reviewCards.length})
          </h2>
          <ul className="space-y-2">
            {reviewCards.map(({ result, card }) => (
              <li key={result.cardId} className="flex items-center justify-between">
                <Link
                  to={`/topic/${topicId}/card/${result.cardId}`}
                  className="text-sm text-gray-300 hover:text-indigo-400 transition-colors truncate flex-1"
                >
                  {card!.title}
                </Link>
                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${QUALITY_COLOR[result.quality]} text-white`}>
                  {QUALITY_LABEL[result.quality]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {upcomingCards.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Next reviews</h2>
          <ul className="space-y-2">
            {upcomingCards.map(({ result, card, progress }) => (
              <li key={result.cardId} className="flex items-center justify-between">
                <span className="text-sm text-gray-400 truncate flex-1">{card!.title}</span>
                <span className="ml-3 text-xs text-indigo-300 font-mono flex-shrink-0">
                  {progress.sm2.dueDate}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link
          to={`/topic/${topicId}/study`}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Study again
        </Link>
        <Link
          to={`/topic/${topicId}`}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-lg transition-colors"
        >
          Back to topic
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-lg transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
