import type { ContentCard } from '@/types'

interface Props {
  card: ContentCard
  isFlipped: boolean
  onFlip: () => void
  userInput: string
  onInputChange: (value: string) => void
}

export default function TeachItBackCard({
  card,
  isFlipped,
  onFlip,
  userInput,
  onInputChange,
}: Props) {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 mb-1">{card.subtopicId}</p>
        <h2 className="text-lg font-semibold text-gray-100">{card.title}</h2>
      </div>

      {!isFlipped ? (
        <div className="p-6">
          <label className="block text-xs text-gray-400 font-semibold mb-2">
            Explain it in your own words:
          </label>
          <textarea
            autoFocus
            value={userInput}
            onChange={e => onInputChange(e.target.value)}
            placeholder="Write your explanation here before revealing the answer..."
            rows={5}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            onClick={onFlip}
            disabled={userInput.trim().length === 0}
            className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Reveal model answer
          </button>
          <p className="text-xs text-center text-gray-600 mt-2">
            Write something first — even a rough attempt counts
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-1">Your answer:</p>
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-3 py-2 text-sm text-gray-300">
              {userInput || <span className="text-gray-500 italic">(no answer entered)</span>}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-green-400 mb-1">Model answer:</p>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2 text-sm text-gray-300">
              {card.explanation}
            </div>
          </div>

          {card.codeExample && (
            <pre className="text-xs bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-gray-300 font-mono">
              {card.codeExample}
            </pre>
          )}

          <p className="text-xs text-center text-gray-500 pt-2">
            Compare your answer to the model answer and rate yourself honestly below
          </p>
        </div>
      )}
    </div>
  )
}
