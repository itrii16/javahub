import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { topicMap } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import ContentCard from '@/components/cards/ContentCard'
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

  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All')

  const topic = topicId ? topicMap[topicId] : null

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
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{topic.group}</p>
            <h1 className="text-2xl font-bold text-gray-100">{topic.title}</h1>
          </div>
          <Link
            to={`/topic/${topic.id}/study`}
            className="flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Study flashcards →
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
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

      <div className="flex items-center gap-2 mb-6">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
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
      </div>

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
              {filtered.map(card => (
                <ContentCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
