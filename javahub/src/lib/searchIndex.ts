import { topics } from '@/content'
import { cheatSheets } from '@/content/cheatsheets'
import { allInterviewQuestions } from '@/content/interview'
import type { Difficulty } from '@/types/content'

export interface SearchResult {
  id: string
  type: 'card' | 'cheatsheet' | 'interview-qa'
  title: string
  topicId: string
  subtopicId?: string
  difficulty?: Difficulty
  snippet: string
  url: string
  score: number
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  // Cards
  for (const topic of topics) {
    for (const sub of topic.subtopics) {
      for (const card of sub.cards) {
        const body = [card.explanation, card.gotcha, card.whyItMatters].join(' ')
        results.push({
          id: card.id,
          type: 'card',
          title: card.title,
          topicId: topic.id,
          subtopicId: sub.id,
          difficulty: card.difficulty,
          snippet: body.slice(0, 120),
          url: `/topic/${topic.id}/card/${card.id}`,
          score: 0,
        })
      }
    }
  }

  // Cheat sheets
  for (const cs of cheatSheets) {
    for (const section of cs.sections) {
      const body = [section.content ?? '', section.codeExample ?? ''].join(' ')
      results.push({
        id: `cs-${cs.id}-${section.title}`,
        type: 'cheatsheet',
        title: `${cs.title} — ${section.title}`,
        topicId: cs.topicId,
        snippet: body.slice(0, 120),
        url: `/cheatsheets/${cs.id}`,
        score: 0,
      })
    }
  }

  // Interview Q&As
  for (const q of allInterviewQuestions) {
    results.push({
      id: q.id,
      type: 'interview-qa',
      title: q.question,
      topicId: q.topicId,
      difficulty: q.difficulty,
      snippet: q.answer.summary.slice(0, 120),
      url: `/interview-prep/${q.topicId}`,
      score: 0,
    })
  }

  return results
}

export function search(
  query: string,
  index: SearchResult[],
  filters?: { topicId?: string; difficulty?: string; type?: string }
): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored = index
    .map(item => {
      let score = 0
      if (item.title.toLowerCase().includes(q)) score += 2
      if (item.snippet.toLowerCase().includes(q)) score += 1
      return { ...item, score }
    })
    .filter(item => item.score > 0)

  let filtered = scored
  if (filters?.topicId) filtered = filtered.filter(r => r.topicId === filters.topicId)
  if (filters?.difficulty) filtered = filtered.filter(r => r.difficulty === filters.difficulty)
  if (filters?.type) filtered = filtered.filter(r => r.type === filters.type)

  return filtered.sort((a, b) => b.score - a.score).slice(0, 50)
}
