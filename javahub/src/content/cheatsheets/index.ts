import solid from './solid.json'
import javaStreams from './java-streams.json'
import designPatterns from './design-patterns.json'
import collections from './collections.json'
import concurrency from './concurrency.json'
import dataStructuresComplexity from './data-structures-complexity.json'
import algorithmsComplexity from './algorithms-complexity.json'
import gcComparison from './gc-comparison.json'
import type { CheatSheet } from '@/types/content'

export const cheatSheets: CheatSheet[] = [
  solid,
  javaStreams,
  designPatterns,
  collections,
  concurrency,
  dataStructuresComplexity,
  algorithmsComplexity,
  gcComparison,
] as CheatSheet[]

export const cheatSheetMap: Record<string, CheatSheet> = Object.fromEntries(
  cheatSheets.map(s => [s.id, s])
)
