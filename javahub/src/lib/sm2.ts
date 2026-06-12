import type { SM2State, CardStatus } from '@/types'

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export const SM2_DEFAULT_STATE: SM2State = {
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  dueDate: todayISO(),
}

export function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function isDueToday(state: SM2State): boolean {
  return state.dueDate <= todayISO()
}

export function reviewCard(
  state: SM2State,
  quality: 1 | 2 | 3 | 4 | 5
): { sm2: SM2State; status: CardStatus } {
  if (quality < 1 || quality > 5) {
    throw new RangeError(`Quality must be 1–5, got ${quality}`)
  }

  const today = todayISO()

  if (quality < 3) {
    return {
      sm2: {
        interval: 1,
        repetition: 0,
        efactor: Math.max(1.3, state.efactor - 0.2),
        dueDate: addDays(today, 1),
      },
      status: 'learning',
    }
  }

  let interval: number
  if (state.repetition === 0) {
    interval = 1
  } else if (state.repetition === 1) {
    interval = 6
  } else {
    interval = Math.round(state.interval * state.efactor)
  }

  const q = quality
  const newEF = state.efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const efactor = Math.max(1.3, parseFloat(newEF.toFixed(2)))

  const newRepetition = state.repetition + 1
  const status: CardStatus = newRepetition >= 3 ? 'mastered' : 'learning'

  return {
    sm2: {
      interval,
      repetition: newRepetition,
      efactor,
      dueDate: addDays(today, interval),
    },
    status,
  }
}

export function getDueCardIds(
  cardIds: string[],
  progressMap: Record<string, { sm2: SM2State; status: CardStatus }>
): string[] {
  return cardIds
    .filter(id => {
      const p = progressMap[id]
      if (!p) return true
      if (p.status === 'mastered') return isDueToday(p.sm2)
      return true
    })
    .sort((a, b) => {
      const aDate = progressMap[a]?.sm2.dueDate ?? '0000-00-00'
      const bDate = progressMap[b]?.sm2.dueDate ?? '0000-00-00'
      return aDate.localeCompare(bDate)
    })
}
