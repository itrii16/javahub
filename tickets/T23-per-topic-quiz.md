# T23 — F3: Per-Topic Quiz UI

## Goal
Build the per-topic practice quiz: 10–15 questions per topic, immediate feedback after each
answer, score summary with links to relevant cards for wrong answers.

---

## Route
Add `/topic/:topicId/quiz` → `QuizPage`

---

## Question sourcing
Reuse `src/content/assessment/questions.json` from T20. Filter by `topicId`.
If fewer than 10 questions exist for a topic, show all available questions (minimum 3 to launch).
Topics without enough questions show a "Not enough questions yet — check back soon" state.

Seed additional questions for the 3 most content-rich topics (java-core, data-structures, oop)
so they reach 10+ questions each. Add them directly to `questions.json`.

---

## Components

### `src/pages/QuizPage.tsx`
- Header: topic name + "Practice Quiz" + question count
- Renders `<QuizQuestionCard />` (reuse from T21) — same component, `showFeedback` prop already built in
- No adaptive drilling in practice mode (no follow-up questions inserted)
- "Next" after feedback, "Finish quiz" on last question → navigate to results

### `src/pages/QuizResultsPage.tsx`
Route: `/topic/:topicId/quiz/results`

Sections:
1. **Score** — large number (e.g. "7 / 10"), percentage, pass/fail label (≥70% = pass)
2. **Wrong answers review** — for each incorrect answer:
   - Question text
   - Your answer (red) vs correct answer (green)
   - Explanation text
   - "Study this card →" link — find the content card in the topic whose `subtopicId` matches the question's `subtopicId`
3. **Actions**: "Retake quiz" | "Study this topic" | "Back to topic"

### Store update — `src/store/useAppStore.ts`
Add to existing quiz history slice:
```ts
quizHistory: Record<string, QuizAttempt[]>;  // topicId → attempts

interface QuizAttempt {
  date: string;
  score: number;
  total: number;
  topicId: string;
}

recordQuizAttempt: (attempt: QuizAttempt) => void;
```
Persist `quizHistory` to localStorage.

---

## Navigation
- Add "Take Quiz" button to `TopicPage` (T08) header area
- Add quiz score chip to sidebar topic list if a quiz has been taken (e.g. "85%")

---

## Design
- Same full-screen centered layout as T21 (no sidebar)
- Score display: large `text-6xl font-bold` in `indigo-400`
- Wrong answer cards: `red-900/20` background, correct answer highlight in `green-400`

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T23: F3 per-topic quiz UI — question flow, immediate feedback, results page`
