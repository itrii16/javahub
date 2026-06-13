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
  | 'AI for Engineers'

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

export interface QuizAttempt {
  date: string
  score: number
  total: number
  topicId: string
}

export interface SimAttempt {
  date: string
  score: number
  total: number
  timeTakenMs: number
  topicScores: Record<string, { correct: number; total: number }>
}

export interface CheatSheetRow {
  label: string
  columns: string[]
}

export interface CheatSheetTable {
  headers: string[]
  rows: CheatSheetRow[]
}

export interface CheatSheetSection {
  title: string
  content?: string
  table?: CheatSheetTable
  codeExample?: string
}

export interface CheatSheet {
  id: string
  title: string
  topicId: string
  sections: CheatSheetSection[]
}

export interface InterviewAnswer {
  summary: string
  full: string
}

export interface TrickyFollowUp {
  question: string
  answer: string
}

export interface InterviewQuestion {
  id: string
  topicId: string
  subtopicId?: string
  question: string
  tags: string[]
  difficulty: Difficulty
  answer: InterviewAnswer
  trickyFollowUp?: TrickyFollowUp
}

export type PrepStatus = 'not-started' | 'in-progress' | 'ready'

export interface SvgComponent {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  shape: 'rect' | 'cylinder' | 'diamond' | 'circle'
  javaNote: string
}

export interface SvgConnection {
  from: string
  to: string
  label?: string
}

export interface SystemDesign {
  id: string
  title: string
  description: string
  requirements: string[]
  nonFunctionalReqs: string[]
  components: SvgComponent[]
  connections: SvgConnection[]
  componentBreakdown: {
    componentId: string
    heading: string
    detail: string
    javaImpl?: string
  }[]
}

export type UserLevel = 'Junior' | 'Mid' | 'Senior'

export interface UserProfile {
  level: UserLevel | null
  assessmentDate: string | null
  topicScores: Record<string, number>
  groupScores: Record<string, number>
}

export type FeatureStatus = 'Preview' | 'Incubating' | 'Finalized'

export interface JepCard {
  jepNumber: number
  title: string
  plainEnglishSummary: string
  codeExample?: string
  status: FeatureStatus
  productionSafe: boolean
  javaVersion: number
}

export interface JavaRelease {
  version: number
  releaseDate: string
  isLts: boolean
  summary: string
  jeps: JepCard[]
  majorFeatures: string[]
}

export interface JavaTimeline {
  releases: JavaRelease[]
  lastUpdated: string
}
