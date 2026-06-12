import { describe, it, expect } from 'vitest'
import { buildAssessmentQueue } from '../javahub/src/lib/assessmentSampler'
import type { QuizQuestion } from '../javahub/src/types/content'

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

const TOPICS = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13']

function makeBank(): QuizQuestion[] {
  return TOPICS.flatMap((t, ti) =>
    Array.from({ length: 4 }, (_, i) =>
      makeQ(`${t}-${i}`, t, i < 2 ? 'Beginner' : i === 2 ? 'Mid' : 'Senior')
    )
  )
}

describe('buildAssessmentQueue', () => {
  it('returns exactly targetCount items when enough questions exist', () => {
    const bank = makeBank()
    const queue = buildAssessmentQueue(bank, 25)
    expect(queue).toHaveLength(25)
  })

  it('each topic appears at most twice in the initial queue', () => {
    const bank = makeBank()
    const queue = buildAssessmentQueue(bank, 25)
    const counts = new Map<string, number>()
    for (const q of queue) counts.set(q.topicId, (counts.get(q.topicId) ?? 0) + 1)
    for (const [, count] of counts) {
      expect(count).toBeLessThanOrEqual(2)
    }
  })

  it('result is shuffled (order differs from input at least once in 10 runs)', () => {
    const bank = makeBank()
    const inputIds = bank.map(q => q.id)
    let diffFound = false
    for (let i = 0; i < 10; i++) {
      const queue = buildAssessmentQueue(bank, 25)
      const queueIds = queue.map(q => q.id)
      if (queueIds.join(',') !== inputIds.slice(0, 25).join(',')) {
        diffFound = true
        break
      }
    }
    expect(diffFound).toBe(true)
  })
})
