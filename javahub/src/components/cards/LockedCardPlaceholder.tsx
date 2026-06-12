import type { Difficulty } from '@/types'

interface Props {
  cardTitle: string
  difficulty: Difficulty
  mastered: number
  total: number
  requiredDifficulty: Difficulty
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Beginner: 'text-green-400 border-green-400/20',
  Mid: 'text-yellow-400 border-yellow-400/20',
  Senior: 'text-red-400 border-red-400/20',
}

export default function LockedCardPlaceholder({
  cardTitle,
  difficulty,
  mastered,
  total,
  requiredDifficulty,
}: Props) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0

  return (
    <div className={`bg-gray-900/50 border border-dashed rounded-xl p-5 opacity-60 ${DIFFICULTY_STYLES[difficulty]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔒</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-400 truncate">{cardTitle}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Master all {requiredDifficulty} cards to unlock ({mastered}/{total} done)
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
