import { describe, it, expect } from 'vitest'
import { buildMarkdownExport } from '@/lib/exportNotes'

const resolver = (cardId: string) => {
  const map: Record<string, { title: string; topicId: string }> = {
    'card-1': { title: 'HashMap Internals', topicId: 'Java Collections' },
    'card-2': { title: 'Thread Safety', topicId: 'Concurrency' },
  }
  return map[cardId] ?? null
}

describe('buildMarkdownExport', () => {
  it('produces correct markdown structure with 2 notes', () => {
    const notes = {
      'card-1': 'HashMap uses array of buckets',
      'card-2': 'Use synchronized or ConcurrentHashMap',
    }
    const md = buildMarkdownExport(notes, resolver)
    expect(md).toContain('# JavaHub Notes Export')
    expect(md).toContain('## HashMap Internals (Java Collections)')
    expect(md).toContain('HashMap uses array of buckets')
    expect(md).toContain('## Thread Safety (Concurrency)')
    expect(md).toContain('---')
  })

  it('returns only header for empty notes object', () => {
    const md = buildMarkdownExport({}, resolver)
    expect(md).toContain('# JavaHub Notes Export')
    expect(md).not.toContain('##')
  })

  it('skips cards not found by resolver', () => {
    const notes = { 'nonexistent-card': 'some note' }
    const md = buildMarkdownExport(notes, resolver)
    expect(md).not.toContain('some note')
    expect(md).toContain('# JavaHub Notes Export')
  })

  it('skips cards with empty notes', () => {
    const notes = { 'card-1': '   ', 'card-2': 'real note' }
    const md = buildMarkdownExport(notes, resolver)
    expect(md).not.toContain('HashMap Internals')
    expect(md).toContain('Thread Safety')
  })
})
