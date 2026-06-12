export type Difficulty = 'Beginner' | 'Mid' | 'Senior'

export interface ComplexityRow {
  operation: string
  best: string
  average: string
  worst: string
  space?: string
}

export interface ContentCard {
  id: string
  topicId: string
  subtopicId: string
  title: string
  difficulty: Difficulty
  explanation: string
  codeExample?: string
  whyItMatters: string
  gotcha: string
  tryItUrl?: string
  complexityTable?: ComplexityRow[]
  vsComparison?: string
  jdkClass?: string
}

export interface Subtopic {
  id: string
  title: string
  cards: ContentCard[]
}

export type TopicGroup =
  | 'Java Core'
  | 'Engineering Principles'
  | 'Architecture & Design'
  | 'Data Structures'
  | 'Algorithms'
  | 'Interview & System Design'

export interface Topic {
  id: string
  title: string
  group: TopicGroup
  estimatedMinutes: number
  subtopics: Subtopic[]
}

export interface FlatCard extends ContentCard {
  topicTitle: string
  subtopicTitle: string
}

export type CardStatus = 'unseen' | 'learning' | 'mastered'

// ─── Assessment ───────────────────────────────────────────────────────────────

export type QuestionFormat = 'multiple-choice' | 'true-false' | 'code-reading'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  topicId: string
  subtopicId: string
  format: QuestionFormat
  difficulty: Difficulty
  question: string
  options: QuizOption[]
  explanation: string
  followUpQuestionId?: string
}

export interface AssessmentAnswer {
  questionId: string
  selectedOptionId: string
  correct: boolean
}

export interface AssessmentSession {
  id: string
  startedAt: string
  completedAt?: string
  answers: AssessmentAnswer[]
  topicScores: Record<string, number>
}

export interface SM2State {
  interval: number
  repetition: number
  efactor: number
  dueDate: string
}

export type UserLevel = 'Junior' | 'Mid' | 'Senior'

export interface UserProfile {
  level: UserLevel | null
  assessmentDate: string | null
  topicScores: Record<string, number>
  groupScores: Record<string, number>
}
