import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { topicMap, allCards } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import ContentCard from '@/components/cards/ContentCard'

export default function CardDetailPage() {
  const { topicId, cardId } = useParams<{ topicId: string; cardId: string }>()
  const setLastVisited = useAppStore(s => s.setLastVisited)

  const topic = topicId ? topicMap[topicId] : null
  const topicCards = topic ? topic.subtopics.flatMap(s => s.cards) : []
  const currentIndex = topicCards.findIndex(c => c.id === cardId)
  const card = currentIndex >= 0 ? topicCards[currentIndex] : null
  const prevCard = currentIndex > 0 ? topicCards[currentIndex - 1] : null
  const nextCard = currentIndex < topicCards.length - 1 ? topicCards[currentIndex + 1] : null

  useEffect(() => {
    if (topicId && cardId) {
      setLastVisited(topicId, cardId)
    }
  }, [topicId, cardId])

  if (!topic || !card) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-4">Card not found.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/topic/${topicId}`}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          ← {topic.title}
        </Link>
        <span className="text-sm text-gray-500">
          Card {currentIndex + 1} of {topicCards.length}
        </span>
      </div>

      <ContentCard card={card} compact={false} />

      <div className="flex items-center justify-between mt-6 gap-4">
        {prevCard ? (
          <Link
            to={`/topic/${topicId}/card/${prevCard.id}`}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors"
          >
            <p className="text-xs text-gray-500 mb-0.5">← Previous</p>
            <p className="text-gray-200 truncate">{prevCard.title}</p>
          </Link>
        ) : <div className="flex-1" />}

        {nextCard ? (
          <Link
            to={`/topic/${topicId}/card/${nextCard.id}`}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors text-right"
          >
            <p className="text-xs text-gray-500 mb-0.5">Next →</p>
            <p className="text-gray-200 truncate">{nextCard.title}</p>
          </Link>
        ) : (
          <Link
            to={`/topic/${topicId}/study`}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm transition-colors text-right"
          >
            <p className="text-xs text-indigo-200 mb-0.5">All cards read!</p>
            <p className="text-white">Start study mode →</p>
          </Link>
        )}
      </div>
    </div>
  )
}
