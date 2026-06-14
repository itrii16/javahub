import type { Topic } from '@/types'
import javaCore from './topics/java-core.json'
import javaExceptions from './topics/java-exceptions.json'
import collections from './topics/collections.json'
import concurrency from './topics/concurrency.json'
import jvmInternals from './topics/jvm-internals.json'
import generics from './topics/generics.json'
import javadoc from './topics/javadoc.json'
import oop from './topics/oop.json'
import solid from './topics/solid.json'
import cleanCode from './topics/clean-code.json'
import designPatterns from './topics/design-patterns.json'
import refactoring from './topics/refactoring.json'
import testing from './topics/testing.json'
import dataStructures from './topics/data-structures.json'
import algorithms from './topics/algorithms.json'
import apiDesign from './topics/api-design.json'
import architecturePatterns from './topics/architecture-patterns.json'
import databaseFundamentals from './topics/database-fundamentals.json'
import distributedSystems from './topics/distributed-systems.json'
import securityBasics from './topics/security-basics.json'
import loggingObservability from './topics/logging-observability.json'
import systemDesign from './topics/system-design.json'
import aiForEngineers from './topics/ai-for-engineers.json'

export const topics: Topic[] = [
  javaCore,
  javaExceptions,
  collections,
  concurrency,
  jvmInternals,
  generics,
  javadoc,
  oop,
  solid,
  cleanCode,
  designPatterns,
  refactoring,
  testing,
  dataStructures,
  algorithms,
  apiDesign,
  architecturePatterns,
  databaseFundamentals,
  distributedSystems,
  securityBasics,
  loggingObservability,
  systemDesign,
  aiForEngineers,
] as unknown as Topic[]

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
