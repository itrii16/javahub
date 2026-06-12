import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { topicMap } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import { reviewCard, getDueCardIds } from '@/lib/sm2'
import FlashCard from '@/components/study/FlashCard'
import RatingBar from '@/components/study/RatingBar'
import TeachItBackCard from '@/components/study/TeachItBackCard'
import type { ContentCard } from '@/types'

export default function StudyPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? topicMap[topicId] : null
  const navigate = useNavigate()

  const getCardProgress = useAppStore(s => s.getCardProgress)
  const setCardProgress = useAppStore(s => s.setCardProgress)
  const incrementSessionCount = useAppStore(s => s.incrementSessionCount)
  const touchStreak = useAppStore(s => s.touchStreak)
  const cardProgressMap = useAppStore(s => s.cardProgress)

  const [queue, setQueue] = useState<ContentCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionResults, setSessionResults] = useState<{ cardId: string; quality: number }[]>([])
  const [mode, setMode] = useState<'flashcard' | 'teach-it-back'>('flashcard')
  const [teachInput, setTeachInput] = useState('')

  useEffect(() => {
    if (!topic) return
    const allCards = topic.subtopics.flatMap(s => s.cards)
    const dueIds = getDueCardIds(allCards.map(c => c.id), cardProgressMap)
    const dueCards = dueIds
      .map(id => allCards.find(c => c.id === id))
      .filter((c): c is ContentCard => c !== undefined)
    setQueue(dueCards)
    incrementSessionCount()
    touchStreak()
  }, [topic?.id])

  const currentCard = queue[currentIndex]
  const progress = currentIndex / Math.max(queue.length, 1)

  const handleRate = useCallback((quality: 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return

    const currentProgress = getCardProgress(currentCard.id)
    const { sm2, status } = reviewCard(currentProgress.sm2, quality)
    setCardProgress(currentCard.id, { sm2, status })
    const updatedResults = [...sessionResults, { cardId: currentCard.id, quality }]
    setSessionResults(updatedResults)

    if (quality < 3) {
      setQueue(prev => [...prev, currentCard])
    }

    if (currentIndex >= queue.length - 1) {
      sessionStorage.setItem(
        'lastSessionResults',
        JSON.stringify({
          topicId,
          results: updatedResults,
          completedAt: new Date().toISOString(),
        })
      )
      navigate(`/topic/${topicId}/study/summary`)
    } else {
      setCurrentIndex(i => i + 1)
      setIsFlipped(false)
      setTeachInput('')
    }
  }, [currentCard, currentIndex, queue.length, sessionResults, topicId, navigate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        setIsFlipped(f => !f)
      }
      if (isFlipped) {
        const map: Record<string, 1 | 2 | 3 | 4 | 5> = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 }
        if (map[e.key]) handleRate(map[e.key])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFlipped, handleRate])

  if (!topic) return <div className="text-gray-400 p-8">Topic not found.</div>

  if (queue.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-xl font-semibold text-gray-100 mb-2">All caught up!</h2>
        <p className="text-gray-400 mb-6">No cards are due for review in {topic.title} right now.</p>
        <Link to={`/topic/${topicId}`} className="text-indigo-400 hover:text-indigo-300">
          ← Back to topic
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/topic/${topicId}`} className="text-sm text-gray-400 hover:text-gray-200">
          ← {topic.title}
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Mode:</span>
            <button
              onClick={() => setMode(m => m === 'flashcard' ? 'teach-it-back' : 'flashcard')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'teach-it-back'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {mode === 'teach-it-back' ? '📝 Teach it back' : '🃏 Flashcard'}
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
      </div>

      <div className="h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {currentCard && (
        mode === 'teach-it-back' ? (
          <TeachItBackCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(f => !f)}
            userInput={teachInput}
            onInputChange={setTeachInput}
          />
        ) : (
          <FlashCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(f => !f)}
          />
        )
      )}

      {isFlipped && (
        <div className="mt-6">
          <RatingBar onRate={handleRate} />
        </div>
      )}

      {!isFlipped && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> or click the card to reveal
        </p>
      )}
    </div>
  )
}
