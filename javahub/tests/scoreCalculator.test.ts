import { describe, it, expect } from 'vitest'
import { computeGroupScores, TOPIC_GROUPS } from '@/lib/scoreCalculator'

describe('computeGroupScores', () => {
  it('all topics at 100 → all groups at 100', () => {
    const scores: Record<string, number> = {}
    for (const topicId of Object.keys(TOPIC_GROUPS)) scores[topicId] = 100
    const result = computeGroupScores(scores)
    for (const v of Object.values(result)) expect(v).toBe(100)
  })

  it('missing topics default to 50', () => {
    const result = computeGroupScores({})
    for (const v of Object.values(result)) expect(v).toBe(50)
  })

  it('averaging is correct for a mixed set', () => {
    // java-core group topics: java-core, collections, concurrency, jvm-internals, generics, javadoc
    const scores: Record<string, number> = {}
    for (const topicId of Object.keys(TOPIC_GROUPS)) scores[topicId] = 50
    scores['java-core'] = 100
    scores['collections'] = 0
    // other 4 in Java Core = 50 each → avg = (100+0+50+50+50+50)/6 ≈ 50
    const result = computeGroupScores(scores)
    expect(result['Java Core']).toBe(50)
  })
})
