# T29 — F6: Full Progress Dashboard

## Goal
Upgrade the existing `HomePage.tsx` (T15 basic homepage) into the full F6 Progress Dashboard
with skill radar chart, quiz history chart, full study plan progress, and sync status.

---

## Prerequisites
T22 must be complete (Recharts radar chart + `computeGroupScores` available).

---

## Sections to add / upgrade in `src/pages/HomePage.tsx`

The T15 homepage already has: streak, last visited, due cards today.
This ticket adds the remaining F6 sections.

### 1. Skill Radar Chart (top of page)
- Import `<SkillRadarChart />` component (extract from T22's `AssessmentResultsPage` into
  `src/components/dashboard/SkillRadarChart.tsx` — reusable)
- If no assessment taken: show "Take your skill assessment" CTA card instead
- If assessment older than 30 days: show amber banner "Your last assessment was X days ago — retake?"

### 2. Study Plan Progress
- List of topics sorted by `userProfile.topicScores` (weakest first)
- Each topic row: name | score bar (0–100, colored red/yellow/green) | "Study" link
- Show top 5 weakest topics only; "Show all →" expands the rest
- Topics with score ≥ 80 show a checkmark instead of a bar

### 3. Quiz Scores History Chart
- Recharts `LineChart` or `BarChart`
- Data: `store.quizHistory` — last 10 quiz attempts across all topics
- X-axis: date (short format), Y-axis: score %
- Tooltip shows: topic name + score
- If no quiz history: "No quiz history yet — take a topic quiz" placeholder

### 4. Cards Due Today (upgrade T15 version)
- Show count of due cards per topic (not just total)
- "Study all due cards" button → `/study?mode=due` (queue all due cards across topics)
- If 0 due: "All caught up! 🎉" message + "Review a topic anyway" link

### 5. Weakest Area Callout
- Highlight the single lowest-scoring topic
- "Your biggest gap: **{topic}** — score {X}%"
- Direct link to study mode and quiz for that topic

### 6. Sync Status Indicator (localStorage-only for now, Supabase in T36)
- Small status chip in top-right of dashboard: "Saved locally" (gray)
- After 3 sessions without account: show persistent amber banner
  "Sync your progress across devices — sign in with Google"
  (Banner can be dismissed; state stored in localStorage as `syncNudgeDismissed`)
- Track session count in store: `sessionCount: number` (increment on app mount, persist)

---

## `src/components/dashboard/SkillRadarChart.tsx`
Extract the radar chart from T22 `AssessmentResultsPage` into this reusable component:
```tsx
interface SkillRadarChartProps {
  groupScores: Record<string, number>;
  size?: number;  // default 300
}
```

---

## Store update
```ts
sessionCount: number;
syncNudgeDismissed: boolean;
incrementSessionCount: () => void;
dismissSyncNudge: () => void;
```
Call `incrementSessionCount()` in `src/main.tsx` on app mount.

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T29: F6 full dashboard — radar chart, quiz history, study plan progress, sync nudge`
