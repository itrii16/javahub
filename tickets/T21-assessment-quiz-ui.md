# T21 — F0: Assessment Quiz UI (Adaptive Flow)

## Goal
Build the interactive assessment quiz (`/assessment`) that samples from the T20 question bank,
applies adaptive drilling on wrong answers, and hands off to the skill profile (T22) on completion.

---

## Route
Add `/assessment` to `src/router.tsx` → `AssessmentPage`.

---

## Pages & components

### `src/pages/AssessmentPage.tsx`
Top-level page. Manages the quiz session state:
- On mount: call `store.startAssessment()`, build the initial queue of 25 questions sampled
  from `questions.json` (1–2 per topic, spread across difficulty levels)
- Sampling logic: `src/lib/assessmentSampler.ts` (pure function, see below)
- Renders one of: `<QuizQuestion />` | `<AssessmentComplete />` transition

### `src/lib/assessmentSampler.ts`
```ts
export function buildAssessmentQueue(
  questions: QuizQuestion[],
  targetCount: number   // 25
): QuizQuestion[]
```
- Stratified sampling: pick 1–2 questions per topic, prefer Beginner/Mid for initial queue
- Shuffle result (Fisher-Yates)

### `src/components/assessment/QuizQuestionCard.tsx`
Renders a single question:
- Question text (render code blocks with `<pre>` + Prism.js Java highlighting)
- Option buttons — clicking selects, second click on selected submits
- On submit: show inline feedback (green ✓ / red ✗ + explanation text)
- "Next" button appears after feedback; if wrong AND question has `followUpQuestionId`,
  insert that question next in the queue (adaptive drilling)
- Progress bar: `current / total` at top (total increases when follow-ups are inserted)

### `src/components/assessment/AssessmentComplete.tsx`
Shown when queue is exhausted:
- "Calculating your skill profile…" spinner (500 ms fake delay for UX)
- Calls `store.completeAssessment(computedTopicScores)`
- Navigates to `/assessment/results`

### `src/pages/AssessmentResultsPage.tsx`
Placeholder page for now (full content in T22). Just shows: "Assessment complete — profile
loading…" and a link to `/assessment/results`. T22 will fill this in.

---

## Skip flow
On the `/assessment` landing screen (before quiz starts), show:
- "Start Assessment" button
- "Skip — I know my level" option → opens a modal with 3 buttons:
  Junior / Mid / Senior → sets `store.userProfile.level` directly and navigates to dashboard

---

## Design
- Full-screen quiz layout (no sidebar), centered card, max-w-2xl
- Current question number + total shown as `3 / 25`
- Option buttons: `gray-800` background, `indigo-500` border on selected, `green-700`/`red-700` on reveal
- Progress bar: `indigo-500` fill on `gray-800` track

---

## Test
Add `tests/assessmentSampler.test.ts`:
- `buildAssessmentQueue` returns exactly `targetCount` items when enough questions exist
- Each topic appears at most twice in the initial queue
- Result is shuffled (run 10 times, at least once order differs from input)

## Commit
`T21: F0 assessment quiz UI — adaptive flow, question card, skip option`
