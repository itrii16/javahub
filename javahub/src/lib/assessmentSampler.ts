import type { QuizQuestion } from '@/types/content'

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildAssessmentQueue(
  questions: QuizQuestion[],
  targetCount: number = 25
): QuizQuestion[] {
  // Group by topic
  const byTopic = new Map<string, QuizQuestion[]>()
  for (const q of questions) {
    const bucket = byTopic.get(q.topicId) ?? []
    bucket.push(q)
    byTopic.set(q.topicId, bucket)
  }

  const selected: QuizQuestion[] = []

  for (const [, qs] of byTopic) {
    // Prefer Beginner/Mid for initial queue
    const preferred = qs.filter(q => q.difficulty !== 'Senior')
    const pool = preferred.length > 0 ? preferred : qs
    const shuffled = fisherYates(pool)
    selected.push(...shuffled.slice(0, 2))
  }

  const shuffled = fisherYates(selected)

  if (shuffled.length >= targetCount) {
    return shuffled.slice(0, targetCount)
  }

  // If we have fewer than targetCount, fill from remaining questions
  const selectedIds = new Set(shuffled.map(q => q.id))
  const remaining = fisherYates(questions.filter(q => !selectedIds.has(q.id)))
  const fill = remaining.slice(0, targetCount - shuffled.length)

  return fisherYates([...shuffled, ...fill])
}
