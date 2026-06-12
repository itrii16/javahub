export interface SM2State {
  interval: number
  repetition: number
  efactor: number
  dueDate: string
}

export type CardStatus = 'unseen' | 'learning' | 'mastered'

export interface CardProgress {
  status: CardStatus
  sm2: SM2State
}

export interface AppProgress {
  cardProgress: Record<string, CardProgress>
  bookmarks: string[]
  notes: Record<string, string>
  lastVisited: Record<string, string>
  streak: {
    lastActive: string
    count: number
  }
  sessionCount: number
  guidedPathTopics: string[]
}
