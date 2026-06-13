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
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-sm mb-4">Topic not found.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to home</Link>
      </div>
    )
  }

  const allCards = topic.subtopics.flatMap(s => s.cards)
  const masteredCount = allCards.filter(c => getCardProgress(c.id).status === 'mastered').length
  const progressPct = allCards.length > 0 ? Math.round((masteredCount / allCards.length) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto">
      {/* Topic header */}
      <div className="mb-8">
        <p className="text-[11px] text-gray-600 uppercase tracking-[0.07em] mb-1">{topic.group}</p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-100">{topic.title}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to={`/topic/${topic.id}/quiz`}
              className="px-3 py-1.5 border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 text-sm rounded-lg transition-colors"
            >
              Quiz
            </Link>
            <Link
              to={`/topic/${topic.id}/study`}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
            >
              Study
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          <span>{allCards.length} cards</span>
          <span>{masteredCount} mastered</span>
          <span>~{topic.estimatedMinutes} min</span>
        </div>

        <div className="mt-3 h-px bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-gray-600">{progressPct}% mastered</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              difficultyFilter === d
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'
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
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isGuidedPath
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-900 border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'
          }`}
        >
          Guided path
        </button>
      </div>

      {/* Cards grouped by subtopic */}
      {topic.subtopics.map(subtopic => {
        const filtered = subtopic.cards.filter(
          card => difficultyFilter === 'All' || card.difficulty === difficultyFilter
        )
        if (filtered.length === 0) return null
        return (
          <section key={subtopic.id} id={subtopic.id} className="mb-10">
            <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-[0.07em] mb-4 pb-2 border-b border-gray-800/60">
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
