import { describe, it, expect } from 'vitest'
import { buildSearchIndex, search } from '@/lib/searchIndex'

const index = buildSearchIndex()

describe('buildSearchIndex', () => {
  it('returns a non-empty index', () => {
    expect(index.length).toBeGreaterThan(0)
  })
})

describe('search', () => {
  it('returns results with matching title first (higher score)', () => {
    const results = search('HashMap', index)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].score).toBeGreaterThanOrEqual(results[results.length - 1].score)
    expect(results.some(r => r.title.toLowerCase().includes('hashmap'))).toBe(true)
  })

  it('returns empty array for nonexistent term', () => {
    expect(search('xyz_nonexistent_term_123', index)).toHaveLength(0)
  })

  it('filter by difficulty=Senior excludes Beginner and Mid results', () => {
    const results = search('java', index, { difficulty: 'Senior' })
    for (const r of results) {
      if (r.difficulty) expect(r.difficulty).toBe('Senior')
    }
  })

  it('filter by type=card returns only cards', () => {
    const results = search('java', index, { type: 'card' })
    for (const r of results) expect(r.type).toBe('card')
  })
})
