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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {dueIds.length > 0
              ? `${dueIds.length} card${dueIds.length === 1 ? '' : 's'} due for review today`
              : 'All caught up! No cards due today.'}
          </p>
        </div>
        {streak.count > 0 && (
          <div className="text-center">
            <p className="text-3xl">🔥</p>
            <p className="text-sm font-semibold text-orange-400">{streak.count} day streak</p>
          </div>
        )}
      </div>

      {sessionCount >= 3 && (
        <div className="mb-6 px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300">Sync your progress</p>
            <p className="text-xs text-gray-400 mt-0.5">Sign in to back up your progress and access it on any device</p>
          </div>
          <button
            disabled
            className="px-3 py-1.5 bg-indigo-600/50 text-indigo-300 text-xs rounded-lg cursor-not-allowed opacity-60"
            title="Coming in Phase 7"
          >
            Sign in (coming soon)
          </button>
        </div>
      )}

      {lastVisitedEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Pick up where you left off
          </h2>
          {lastVisitedEntries.map(({ topicId, cardId, topic, card }) => (
            <Link
              key={topicId}
              to={`/topic/${topicId}/card/${cardId}`}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl p-4 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{topic!.title}</p>
                <p className="text-sm font-medium text-gray-200 truncate">{card!.title}</p>
              </div>
              <span className="text-indigo-400 text-sm flex-shrink-0">Continue →</span>
            </Link>
          ))}
        </section>
      )}

      {dueIds.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Due for review today
          </h2>
          <div className="grid gap-3">
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
                    className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl px-4 py-3 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-200">{topic.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{topicDue} card{topicDue === 1 ? '' : 's'} due</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-lg">
                      Study now
                    </span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          All topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topicStats.map(({ topic, total, mastered, due }) => {
            const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
            return (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{topic.group}</p>
                    <p className="text-sm font-semibold text-gray-200">{topic.title}</p>
                  </div>
                  {due > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full flex-shrink-0">
                      {due} due
                    </span>
                  )}
                </div>

                <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
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
