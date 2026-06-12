import { describe, it, expect } from 'vitest'
import { buildSimQueue } from '@/lib/simSampler'
import type { QuizQuestion } from '@/types/content'

function makeQ(id: string, topicId: string, difficulty: 'Beginner' | 'Mid' | 'Senior' = 'Beginner'): QuizQuestion {
  return {
    id,
    topicId,
    subtopicId: 'sub',
    format: 'multiple-choice',
    difficulty,
    question: `Q ${id}`,
    options: [{ id: 'a', text: 'A', isCorrect: true }],
    explanation: 'exp',
  }
}

const TOPICS = Array.from({ length: 15 }, (_, i) => `t${i + 1}`)

function makeBank(): QuizQuestion[] {
  return TOPICS.flatMap(t =>
    Array.from({ length: 5 }, (_, i) =>
      makeQ(`${t}-${i}`, t, i < 2 ? 'Beginner' : i < 4 ? 'Mid' : 'Senior')
    )
  )
}

describe('buildSimQueue', () => {
  it('returns exactly 30 questions', () => {
    const bank = makeBank()
    const queue = buildSimQueue(bank, {}, 30)
    expect(queue).toHaveLength(30)
  })

  it('no question appears twice', () => {
    const bank = makeBank()
    const queue = buildSimQueue(bank, {}, 30)
    const ids = queue.map(q => q.id)
    expect(new Set(ids).size).toBe(30)
  })

  it('weak topics appear more than strong topics with skewed profile', () => {
    const bank = makeBank()
    // t1 is very weak, t2 is very strong
    const topicScores: Record<string, number> = {}
    TOPICS.forEach(t => topicScores[t] = 80)  // default strong
    topicScores['t1'] = 0   // very weak
    topicScores['t2'] = 100 // very strong

    // Run many times and count occurrences
    let t1Count = 0
    let t2Count = 0
    for (let i = 0; i < 20; i++) {
      const q = buildSimQueue(bank, topicScores, 30)
      t1Count += q.filter(x => x.topicId === 't1').length
      t2Count += q.filter(x => x.topicId === 't2').length
    }
    // t1 (weak) should appear more than t2 (strong) across many runs
    expect(t1Count).toBeGreaterThan(t2Count)
  })
})
