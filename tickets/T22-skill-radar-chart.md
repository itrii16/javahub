# T22 — F0: Skill Radar Chart & Study Plan

## Goal
Build the post-assessment results page: a Recharts radar/spider chart showing skill profile,
a plain-language summary, and a prioritized personalized study plan.

---

## Dependencies
Install Recharts if not already present: `npm install recharts`
Install types: `npm install -D @types/recharts` (skip if not available — Recharts ships its own types)

---

## Score computation — `src/lib/scoreCalculator.ts`

```ts
// Maps topicId → group label (7 axes)
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
};

export function computeGroupScores(
  topicScores: Record<string, number>
): Record<string, number>  // group label → 0–100 average
```

The 7 radar axes: `Java Core`, `Engineering Principles`, `Architecture & Design`,
`Interview & System Design`, `Database & Security`, `Concurrency & Systems`, `Interview Readiness`.

Simplification: collapse 21 topics into 7 axis scores by averaging topic scores within each group.
Topics with no score (not assessed) default to 50.

---

## Pages & components

### `src/pages/AssessmentResultsPage.tsx` (replace placeholder from T21)

**Section 1 — Radar Chart**
```tsx
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
```
- `ResponsiveContainer` width 100% height 350
- Color fill: `indigo-500` at 50% opacity, stroke `indigo-400`
- Threshold bands (background-only): no SVG complexity — just use color coding on axis labels
  (red label <40, yellow 40–70, green >70)

**Section 2 — Plain-language summary**
- "Your strongest area is **X**" (highest axis)
- "Your biggest gap is **Y**" (lowest axis)
- Interview readiness label: *Not ready* (<40 avg) / *Getting there* (40–55) / *Almost there* (55–70) / *Interview ready* (>70)

**Section 3 — Personalized Study Plan**
- Sorted list of topics from weakest to strongest (use individual topic scores, not group scores)
- Each row: topic name | score badge | estimated minutes | "Study now →" link to `/topic/:id`
- Topics with score ≥ 80 are collapsed under an "Already strong" disclosure

**Section 4 — Actions**
- "Start studying" → `/topic/{weakest-topic-id}`
- "Go to dashboard" → `/`

---

## Store additions (extend T20 slice)

```ts
userProfile: {
  level: 'Junior' | 'Mid' | 'Senior' | null;
  assessmentDate: string | null;
  topicScores: Record<string, number>;   // topicId → 0–100
  groupScores: Record<string, number>;   // group → 0–100
};
setUserProfile: (profile: Partial<UserProfile>) => void;
```

Persist `userProfile` to localStorage.

---

## Re-assessment (F0.4)
- `AssessmentResultsPage` shows a "Retake assessment" button (links back to `/assessment`)
- Dashboard (T29) shows a retake link when `assessmentDate` is >30 days ago
- **Before/after overlay**: when a re-assessment is completed and a previous `topicScores` exists in the store, show a second radar line on the chart (dashed, `gray-500`) representing the old scores alongside the new scores (`indigo-400`). Add a legend: "Previous" (gray dashed) / "Current" (indigo). Store the previous scores as `userProfile.previousTopicScores` before overwriting.
- **Per-topic re-test prompt**: after a user completes a Study Mode session (T13 `SessionSummaryPage`), show a chip: "Re-test your {topic} knowledge? → Take quiz" linking to `/topic/:topicId/quiz`

---

## Test
Add `tests/scoreCalculator.test.ts`:
- `computeGroupScores` with all topics at 100 → all groups at 100
- Missing topics default to 50
- Averaging is correct for a mixed set

## Commit
`T22: F0 skill radar chart, score computation, study plan results page`
