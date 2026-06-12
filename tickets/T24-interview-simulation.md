# T24 — F3: Interview Simulation Mode + PDF Report

## Goal
Build the 30-question timed interview simulation quiz and a downloadable PDF results report.

---

## Routes
- `/interview-sim` → `InterviewSimPage`
- `/interview-sim/results` → `InterviewSimResultsPage`

---

## Question sourcing
Reuse `questions.json`. Build a 30-question set:
- Weighted sampling: topics where `store.userProfile.topicScores[topicId]` is lowest get more questions
- Fallback (no profile): uniform random sampling across all topics
- Mix difficulty: ~40% Beginner, 40% Mid, 20% Senior
- Sampling logic: add `src/lib/simSampler.ts` (pure function)

---

## `src/pages/InterviewSimPage.tsx`

**Pre-sim screen**:
- Title: "Interview Simulation"
- Rules: 30 questions, 45-minute timer, no feedback during quiz, results at end
- "Start" button → begins timer and shows first question

**During quiz**:
- Countdown timer (top right): `MM:SS` format, turns `red-400` at 5 minutes remaining
- Strict mode: no feedback shown after answering, just option highlight + "Next"
- Progress: `Q 12 / 30`
- Timer expiry: auto-submit with unanswered questions marked incorrect

**On finish** (all answered or timer expired):
- Navigate to `/interview-sim/results` with session data in router state

---

## `src/pages/InterviewSimResultsPage.tsx`

Sections:
1. **Overall score** + time taken + pass/fail label (≥70% = pass)
2. **Score breakdown by topic** — bar chart (Recharts `BarChart`) or simple table: topic | correct/total | %
3. **Full question review** — all 30 questions with: your answer, correct answer, explanation
4. **Recommended study areas** — bottom 3 topics by score, each with a "Study now →" link
5. **Download PDF** button (see below) and **Print** button (`window.print()`)

---

## PDF generation — `src/lib/pdfReport.ts`

Use the browser's built-in print-to-PDF via a print stylesheet approach (no external PDF library):
```ts
export function printSimReport(results: SimResults): void {
  // Open a new window, write print-optimised HTML, trigger window.print()
}
```

The printed/saved page must include:
- Header: "JavaHub — Interview Simulation Results" + date
- Score summary
- Topic breakdown table
- All wrong answers with explanations
- "Recommended study areas" section

Add a `@media print` Tailwind variant or inline styles in the generated HTML to hide navigation.

---

## Store update
```ts
simHistory: SimAttempt[];

interface SimAttempt {
  date: string;
  score: number;
  total: number;
  timeTakenMs: number;
  topicScores: Record<string, { correct: number; total: number }>;
}

recordSimAttempt: (attempt: SimAttempt) => void;
```

---

## Navigation
- Add "Interview Simulation" link in sidebar under "Interview Prep" section header
- Add entry point card on Dashboard (T33)

---

## Test
Add `tests/simSampler.test.ts`:
- Returns exactly 30 questions
- Weak topics appear more than strong topics (with a skewed profile input)
- No question appears twice

## Commit
`T24: F3 interview simulation mode — timed quiz, results, PDF print report`
