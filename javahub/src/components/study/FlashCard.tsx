import type { ContentCard } from '@/types'

interface Props {
  card: ContentCard
  isFlipped: boolean
  onFlip: () => void
}

const DIFFICULTY_STYLES = {
  Beginner: 'text-green-400',
  Mid: 'text-yellow-400',
  Senior: 'text-red-400',
}

export default function FlashCard({ card, isFlipped, onFlip }: Props) {
  return (
    <div
      onClick={onFlip}
      className="cursor-pointer select-none"
      role="button"
      aria-label={isFlipped ? 'Card revealed — rate your recall' : 'Click to reveal answer'}
    >
      {!isFlipped ? (
        <div className="min-h-48 flex flex-col items-center justify-center bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-8 text-center transition-colors">
          <span className={`text-[11px] font-medium uppercase tracking-[0.06em] mb-3 ${DIFFICULTY_STYLES[card.difficulty]}`}>
            {card.difficulty}
          </span>
          <h2 className="text-xl font-semibold text-gray-100 leading-snug">{card.title}</h2>
          <p className="text-xs text-gray-600 mt-4">{card.subtopicId}</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-6 transition-colors">
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{card.explanation}</p>
          {card.codeExample && (
            <pre className="text-xs bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-gray-400 font-mono">
              {card.codeExample}
            </pre>
          )}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-[0.06em] mb-1">Gotcha</p>
            <p className="text-xs text-gray-500">{card.gotcha}</p>
          </div>
        </div>
      )}
    </div>
  )
}
