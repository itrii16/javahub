import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { topics, allCards } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import { getDueCardIds } from '@/lib/sm2'

export default function HomePage() {
  const streak = useAppStore(s => s.streak)
  const lastVisited = useAppStore(s => s.lastVisited)
  const cardProgressMap = useAppStore(s => s.cardProgress)
  const sessionCount = useAppStore(s => s.sessionCount)

  const allCardIds = useMemo(() => allCards.map(c => c.id), [])
  const dueIds = useMemo(
    () => getDueCardIds(allCardIds, cardProgressMap),
    [allCardIds, cardProgressMap]
  )

  const lastVisitedEntries = useMemo(() => {
    return Object.entries(lastVisited)
      .map(([topicId, cardId]) => ({
        topicId,
        cardId,
        topic: topics.find(t => t.id === topicId),
        card: allCards.find(c => c.id === cardId),
      }))
      .filter(e => e.topic && e.card)
      .slice(0, 1)
  }, [lastVisited])

  const topicStats = useMemo(() => {
    return topics.map(topic => {
      const cards = topic.subtopics.flatMap(s => s.cards)
      const mastered = cards.filter(
        c => cardProgressMap[c.id]?.status === 'mastered'
      ).length
      const due = getDueCardIds(cards.map(c => c.id), cardProgressMap).length
      return { topic, total: cards.length, mastered, due }
    })
  }, [cardProgressMap])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            {dueIds.length > 0
              ? `${dueIds.length} card${dueIds.length === 1 ? '' : 's'} due for review`
              : 'All caught up — no cards due today'}
          </p>
        </div>
        {streak.count > 0 && (
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-100">{streak.count}</p>
            <p className="text-xs text-gray-600">day streak</p>
          </div>
        )}
      </div>

      {/* Sync nudge */}
      {sessionCount >= 3 && (
        <div className="mb-8 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">Sync your progress</p>
            <p className="text-xs text-gray-500 mt-0.5">Back up and access your progress on any device</p>
          </div>
          <button
            disabled
            className="px-3 py-1.5 border border-gray-700 text-gray-500 text-xs rounded-lg cursor-not-allowed"
            title="Coming in a future update"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Pick up where you left off */}
      {lastVisitedEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">
            Continue
          </h2>
          {lastVisitedEntries.map(({ topicId, cardId, topic, card }) => (
            <Link
              key={topicId}
              to={`/topic/${topicId}/card/${cardId}`}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-600 mb-0.5">{topic!.title}</p>
                <p className="text-sm font-medium text-gray-200 truncate">{card!.title}</p>
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0">
                Continue →
              </span>
            </Link>
          ))}
        </section>
      )}

      {/* Due for review */}
      {dueIds.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">
            Due today
          </h2>
          <div className="flex flex-col gap-2">
            {topics
              .filter(topic => {
                const topicCardIds = topic.subtopics.flatMap(s => s.cards).map(c => c.id)
                return topicCardIds.some(id => dueIds.includes(id))
              })
              .map(topic => {
                const topicCardIds = topic.subtopics.flatMap(s => s.cards).map(c => c.id)
                const topicDue = topicCardIds.filter(id => dueIds.includes(id)).length
                return (
                  <Link
                    key={topic.id}
                    to={`/topic/${topic.id}/study`}
                    className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-200">{topic.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{topicDue} card{topicDue === 1 ? '' : 's'} due</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors">
                      Study
                    </span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      {/* All topics */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">
          Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicStats.map(({ topic, total, mastered, due }) => {
            const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
            return (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-600 mb-0.5 truncate">{topic.group}</p>
                    <p className="text-sm font-medium text-gray-200 group-hover:text-gray-100 transition-colors">{topic.title}</p>
                  </div>
                  {due > 0 && (
                    <span className="ml-2 text-[11px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded flex-shrink-0">
                      {due}
                    </span>
                  )}
                </div>

                <div className="h-px bg-gray-800 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-600">
                  <span>{mastered}/{total} mastered</span>
                  <span>~{topic.estimatedMinutes} min</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
