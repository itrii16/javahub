import type { Difficulty } from '@/types'

interface Props {
  cardTitle: string
  difficulty: Difficulty
  mastered: number
  total: number
  requiredDifficulty: Difficulty
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Beginner: 'text-green-400 border-green-400/15',
  Mid: 'text-yellow-400 border-yellow-400/15',
  Senior: 'text-red-400 border-red-400/15',
}

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
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
    <div className={`bg-gray-900/40 border border-dashed rounded-xl p-5 opacity-50 ${DIFFICULTY_STYLES[difficulty]}`}>
      <div className="flex items-center gap-3">
        <LockIcon />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{cardTitle}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            Master all {requiredDifficulty} cards to unlock · {mastered}/{total} done
          </p>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <div className="mt-3 h-0.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
