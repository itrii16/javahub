import type { Topic } from '@/types'
import javaCore from './topics/java-core.json'
import oop from './topics/oop.json'
import dataStructures from './topics/data-structures.json'

export const topics: Topic[] = [
  javaCore as unknown as Topic,
  oop as unknown as Topic,
  dataStructures as unknown as Topic,
]

export const topicMap: Record<string, Topic> = Object.fromEntries(
  topics.map(t => [t.id, t])
)

export const allCards = topics.flatMap(topic =>
  topic.subtopics.flatMap(sub =>
    sub.cards.map(card => ({
      ...card,
      topicTitle: topic.title,
      subtopicTitle: sub.title,
    }))
  )
)
