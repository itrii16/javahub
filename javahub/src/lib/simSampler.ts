import type { QuizQuestion } from '@/types/content'

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildSimQueue(
  questions: QuizQuestion[],
  topicScores: Record<string, number>,  // topicId → 0–100, empty = no profile
  targetCount: number = 30
): QuizQuestion[] {
  const hasProfile = Object.keys(topicScores).length > 0

  // Assign weight per question: weak topics get higher weight
  const weighted: { q: QuizQuestion; weight: number }[] = questions.map(q => {
    let weight = 1
    if (hasProfile) {
      const score = topicScores[q.topicId] ?? 50
      // lower score → higher weight (inverted, 0–100 → weight 1–5)
      weight = 1 + Math.round(((100 - score) / 100) * 4)
    }
    // Difficulty mix: ~40% Beginner (1), 40% Mid (2), 20% Senior (0.5)
    const diffWeight = q.difficulty === 'Beginner' ? 1 : q.difficulty === 'Mid' ? 1 : 0.5
    weight *= diffWeight
    return { q, weight }
  })

  // Expand weighted pool
  const pool: QuizQuestion[] = []
  for (const { q, weight } of weighted) {
    const count = Math.max(1, Math.round(weight))
    for (let i = 0; i < count; i++) pool.push(q)
  }

  // Shuffle and deduplicate (pick first occurrence of each id)
  const shuffled = fisherYates(pool)
  const seen = new Set<string>()
  const selected: QuizQuestion[] = []
  for (const q of shuffled) {
    if (!seen.has(q.id)) {
      seen.add(q.id)
      selected.push(q)
      if (selected.length === targetCount) break
    }
  }

  // If not enough unique questions, fill from remaining
  if (selected.length < targetCount) {
    const remaining = fisherYates(questions.filter(q => !seen.has(q.id)))
    for (const q of remaining) {
      selected.push(q)
      if (selected.length === targetCount) break
    }
  }

  return fisherYates(selected)
}
