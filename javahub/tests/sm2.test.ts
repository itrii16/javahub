import { describe, it, expect } from 'vitest'
import {
  reviewCard,
  getDueCardIds,
  isDueToday,
  addDays,
  todayISO,
  SM2_DEFAULT_STATE,
} from '@/lib/sm2'
import type { SM2State } from '@/types'

describe('addDays', () => {
  it('adds days correctly', () => {
    expect(addDays('2024-01-01', 1)).toBe('2024-01-02')
    expect(addDays('2024-01-31', 1)).toBe('2024-02-01')
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
  })

  it('handles 0 days', () => {
    expect(addDays('2024-06-01', 0)).toBe('2024-06-01')
  })
})

describe('isDueToday', () => {
  it('returns true for today', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, dueDate: todayISO() }
    expect(isDueToday(state)).toBe(true)
  })

  it('returns true for overdue cards', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, dueDate: '2020-01-01' }
    expect(isDueToday(state)).toBe(true)
  })

  it('returns false for future cards', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, dueDate: '2099-01-01' }
    expect(isDueToday(state)).toBe(false)
  })
})

describe('reviewCard — failed (quality < 3)', () => {
  it('quality 1: resets repetition and shortens interval', () => {
    const state: SM2State = { interval: 10, repetition: 3, efactor: 2.5, dueDate: '2024-01-01' }
    const { sm2, status } = reviewCard(state, 1)
    expect(sm2.repetition).toBe(0)
    expect(sm2.interval).toBe(1)
    expect(sm2.efactor).toBe(2.3)
    expect(status).toBe('learning')
  })

  it('quality 2: lowers ease factor', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, efactor: 2.5 }
    const { sm2 } = reviewCard(state, 2)
    expect(sm2.efactor).toBe(2.3)
    expect(sm2.repetition).toBe(0)
  })

  it('efactor does not drop below 1.3', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, efactor: 1.3 }
    const { sm2 } = reviewCard(state, 1)
    expect(sm2.efactor).toBe(1.3)
  })
})

describe('reviewCard — passed (quality >= 3)', () => {
  it('quality 3 on first review: interval = 1', () => {
    const { sm2, status } = reviewCard(SM2_DEFAULT_STATE, 3)
    expect(sm2.interval).toBe(1)
    expect(sm2.repetition).toBe(1)
    expect(status).toBe('learning')
  })

  it('quality 4 on second review: interval = 6', () => {
    const state: SM2State = { interval: 1, repetition: 1, efactor: 2.5, dueDate: todayISO() }
    const { sm2 } = reviewCard(state, 4)
    expect(sm2.interval).toBe(6)
    expect(sm2.repetition).toBe(2)
  })

  it('quality 5 on third review: interval = round(prev * EF)', () => {
    const state: SM2State = { interval: 6, repetition: 2, efactor: 2.5, dueDate: todayISO() }
    const { sm2, status } = reviewCard(state, 5)
    expect(sm2.interval).toBe(15)
    expect(sm2.repetition).toBe(3)
    expect(status).toBe('mastered')
  })

  it('quality 5 increases ease factor', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, efactor: 2.5 }
    const { sm2 } = reviewCard(state, 5)
    expect(sm2.efactor).toBeGreaterThan(2.5)
  })

  it('quality 3 decreases ease factor slightly', () => {
    const state: SM2State = { ...SM2_DEFAULT_STATE, efactor: 2.5 }
    const { sm2 } = reviewCard(state, 3)
    expect(sm2.efactor).toBeLessThan(2.5)
  })
})

describe('reviewCard — status progression', () => {
  it('goes unseen → learning → learning → mastered after 3 quality 4+ reviews', () => {
    let state = SM2_DEFAULT_STATE

    const r1 = reviewCard(state, 4)
    expect(r1.status).toBe('learning')
    state = r1.sm2

    const r2 = reviewCard({ ...state, repetition: 1 }, 4)
    expect(r2.status).toBe('learning')
    state = r2.sm2

    const r3 = reviewCard({ ...state, repetition: 2 }, 4)
    expect(r3.status).toBe('mastered')
  })
})

describe('reviewCard — input validation', () => {
  it('throws on invalid quality', () => {
    expect(() => reviewCard(SM2_DEFAULT_STATE, 0 as never)).toThrow(RangeError)
    expect(() => reviewCard(SM2_DEFAULT_STATE, 6 as never)).toThrow(RangeError)
  })
})

describe('getDueCardIds', () => {
  it('returns unseen cards as due', () => {
    const due = getDueCardIds(['card-1', 'card-2'], {})
    expect(due).toContain('card-1')
    expect(due).toContain('card-2')
  })

  it('excludes mastered cards that are not due', () => {
    const progress = {
      'card-1': {
        sm2: { ...SM2_DEFAULT_STATE, dueDate: '2099-12-31' },
        status: 'mastered' as const,
      },
    }
    const due = getDueCardIds(['card-1'], progress)
    expect(due).not.toContain('card-1')
  })

  it('includes mastered cards that are due today', () => {
    const progress = {
      'card-1': {
        sm2: { ...SM2_DEFAULT_STATE, dueDate: todayISO() },
        status: 'mastered' as const,
      },
    }
    const due = getDueCardIds(['card-1'], progress)
    expect(due).toContain('card-1')
  })

  it('sorts by due date ascending', () => {
    const progress = {
      'card-a': { sm2: { ...SM2_DEFAULT_STATE, dueDate: '2024-06-02' }, status: 'learning' as const },
      'card-b': { sm2: { ...SM2_DEFAULT_STATE, dueDate: '2024-06-01' }, status: 'learning' as const },
    }
    const due = getDueCardIds(['card-a', 'card-b'], progress)
    expect(due[0]).toBe('card-b')
    expect(due[1]).toBe('card-a')
  })
})
