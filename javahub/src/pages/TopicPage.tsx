import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { topicMap } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import ContentCard from '@/components/cards/ContentCard'
import LockedCardPlaceholder from '@/components/cards/LockedCardPlaceholder'
import { isCardLocked, getUnlockProgress } from '@/lib/guidedPath'
import type { Difficulty } from '@/types'

const DIFFICULTIES: ('All' | Difficulty)[] = ['All', 'Beginner', 'Mid', 'Senior']

const DIFFICULTY_DOT: Record<Difficulty, string> = {
  Beginner: 'bg-green-400',
  Mid: 'bg-yellow-400',
  Senior: 'bg-red-400',
}

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const setLastVisited = useAppStore(s => s.setLastVisited)
  const getCardProgress = useAppStore(s => s.getCardProgress)
  const cardProgressMap = useAppStore(s => s.cardProgress)
  const toggleGuidedPath = useAppStore(s => s.toggleGuidedPath)

  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All')

  const topic = topicId ? topicMap[topicId] : null
  const isGuidedPath = useAppStore(s => topicId ? s.isGuidedPath(topicId) : false)

  useEffect(() => {
    if (topic && topic.subtopics[0]?.cards[0]) {
      setLastVisited(topic.id, topic.subtopics[0].cards[0].id)
    }
  }, [topic?.id])

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-4">Topic not found.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back to Home</Link>
      </div>
    )
  }

  const allCards = topic.subtopics.flatMap(s => s.cards)
  const masteredCount = allCards.filter(c => getCardProgress(c.id).status === 'mastered').length
  const progressPct = allCards.length > 0 ? Math.round((masteredCount / allCards.length) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto">
      {/* Topic header */}
      <div className="mb-6">
        <div className="mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{topic.group}</p>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-100">{topic.title}</h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to={`/topic/${topic.id}/quiz`}
                className="px-3 py-1.5 md:px-4 md:py-2 border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 text-sm font-medium rounded-lg transition-colors"
              >
                Take Quiz
              </Link>
              <Link
                to={`/topic/${topic.id}/study`}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Study →
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
          <span>⏱ ~{topic.estimatedMinutes} min</span>
          <span>{allCards.length} cards</span>
          <span>{masteredCount} mastered</span>
        </div>
        <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">{progressPct}% mastered</p>
      </div>

      {/* Difficulty filter — scrollable on mobile */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              difficultyFilter === d
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            {d !== 'All' && (
              <span className={`w-1.5 h-1.5 rounded-full ${DIFFICULTY_DOT[d]}`} />
            )}
            {d}
          </button>
        ))}
        <button
          onClick={() => topic && toggleGuidedPath(topic.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            isGuidedPath
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
          }`}
        >
          {isGuidedPath ? '🔒 Guided path on' : '📖 Guided path'}
        </button>
      </div>

      {/* Cards grouped by subtopic */}
      {topic.subtopics.map(subtopic => {
        const filtered = subtopic.cards.filter(
          card => difficultyFilter === 'All' || card.difficulty === difficultyFilter
        )
        if (filtered.length === 0) return null
        return (
          <section key={subtopic.id} id={subtopic.id} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-800">
              {subtopic.title}
            </h2>
            <div className="flex flex-col gap-4">
              {filtered.map(card => {
                const locked = isGuidedPath && isCardLocked(card, allCards, cardProgressMap)
                if (locked) {
                  const { total, mastered, requiredDifficulty } = getUnlockProgress(
                    card.difficulty, allCards, cardProgressMap
                  )
                  return (
                    <LockedCardPlaceholder
                      key={card.id}
                      cardTitle={card.title}
                      difficulty={card.difficulty}
                      mastered={mastered}
                      total={total}
                      requiredDifficulty={requiredDifficulty}
                    />
                  )
                }
                return <ContentCard key={card.id} card={card} />
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
