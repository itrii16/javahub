import type { ContentCard, Difficulty } from '@/types'
import type { CardProgress } from '@/types'

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Beginner: 0,
  Mid: 1,
  Senior: 2,
}

export function isCardLocked(
  card: ContentCard,
  allTopicCards: ContentCard[],
  progressMap: Record<string, CardProgress>
): boolean {
  const cardLevel = DIFFICULTY_ORDER[card.difficulty]
  if (cardLevel === 0) return false

  const lowerCards = allTopicCards.filter(
    c => DIFFICULTY_ORDER[c.difficulty] < cardLevel
  )

  return lowerCards.some(c => {
    const progress = progressMap[c.id]
    return !progress || progress.status !== 'mastered'
  })
}

export function getUnlockProgress(
  targetDifficulty: Difficulty,
  allTopicCards: ContentCard[],
  progressMap: Record<string, CardProgress>
): { total: number; mastered: number; requiredDifficulty: Difficulty } {
  const targetLevel = DIFFICULTY_ORDER[targetDifficulty]
  const requiredLevel = targetLevel - 1
  const requiredDifficulty = (Object.entries(DIFFICULTY_ORDER).find(
    ([, v]) => v === requiredLevel
  )?.[0] ?? 'Beginner') as Difficulty

  const prereqCards = allTopicCards.filter(
    c => DIFFICULTY_ORDER[c.difficulty] === requiredLevel
  )

  const mastered = prereqCards.filter(
    c => progressMap[c.id]?.status === 'mastered'
  ).length

  return { total: prereqCards.length, mastered, requiredDifficulty }
}
