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
