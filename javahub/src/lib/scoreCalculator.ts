export const TOPIC_GROUPS: Record<string, string> = {
  'java-core': 'Java Core',
  'collections': 'Java Core',
  'concurrency': 'Java Core',
  'jvm-internals': 'Java Core',
  'generics': 'Java Core',
  'javadoc': 'Java Core',
  'oop': 'Engineering Principles',
  'solid': 'Engineering Principles',
  'clean-code': 'Engineering Principles',
  'design-patterns': 'Engineering Principles',
  'refactoring': 'Engineering Principles',
  'testing': 'Engineering Principles',
  'api-design': 'Architecture & Design',
  'architecture-patterns': 'Architecture & Design',
  'database-fundamentals': 'Architecture & Design',
  'distributed-systems': 'Architecture & Design',
  'security-basics': 'Architecture & Design',
  'logging-observability': 'Architecture & Design',
  'data-structures': 'Interview & System Design',
  'algorithms': 'Interview & System Design',
  'system-design': 'Interview & System Design',
}

export const ALL_GROUPS = [
  'Java Core',
  'Engineering Principles',
  'Architecture & Design',
  'Interview & System Design',
] as const

export function computeGroupScores(
  topicScores: Record<string, number>
): Record<string, number> {
  const groupSums: Record<string, number[]> = {}

  for (const [topicId, group] of Object.entries(TOPIC_GROUPS)) {
    if (!groupSums[group]) groupSums[group] = []
    const score = topicScores[topicId] ?? 50
    groupSums[group].push(score)
  }

  const result: Record<string, number> = {}
  for (const group of ALL_GROUPS) {
    const scores = groupSums[group] ?? []
    result[group] = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 50
  }
  return result
}
