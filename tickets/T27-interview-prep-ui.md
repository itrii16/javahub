# T27 — F5: Interview Prep Track UI

## Goal
Build the Interview Prep Track: a topic checklist with progress tracking, expandable Q&A viewer,
and the behavioral questions section.

---

## Routes
- `/interview-prep` → `InterviewPrepPage` (checklist + overview)
- `/interview-prep/:topicId` → `InterviewPrepTopicPage` (Q&A for a single topic)
- `/interview-prep/behavioral` → `BehavioralQuestionsPage`

---

## Types — add to `src/types/content.ts`
```ts
export type PrepStatus = 'not-started' | 'in-progress' | 'ready';
```

## Store update — `src/store/useAppStore.ts`
```ts
interviewPrepStatus: Record<string, PrepStatus>;  // topicId → status
setPrepStatus: (topicId: string, status: PrepStatus) => void;
```
Persist `interviewPrepStatus` to localStorage.

---

## Pages & components

### `src/pages/InterviewPrepPage.tsx`

**Header section**:
- Title "Interview Prep Track"
- Overall readiness: `X / 21 topics ready`
- Estimated total prep time remaining (sum `estimatedMinutes` from non-ready topics)

**Topic checklist**:
- One row per topic (use the 21 topics from content JSON files)
- Each row: topic name | status badge (Not started / In progress / Ready) | status cycle button | "Study Q&A →" link
- Group rows by topic group (Java Core, Engineering Principles, etc.) with collapsible group headers
- Status cycle: clicking the button cycles through not-started → in-progress → ready → not-started

**Quick links**:
- "Interview Simulation (30 questions)" → `/interview-sim`
- "Behavioral Questions" → `/interview-prep/behavioral`

### `src/pages/InterviewPrepTopicPage.tsx`

Shows all `InterviewQuestion` for the given `topicId` (from T26 content).

For each question:
- Question text (always visible)
- Difficulty badge
- Tags chips
- **"Show answer" toggle**: collapsed by default (so user can answer mentally first)
  - Collapsed: shows `answer.summary`
  - Expanded: shows `answer.full` (render as markdown with `<ReactMarkdown>` or simple prose)
- **Tricky follow-up** section (if present): same show/hide toggle, indented

Navigation: breadcrumb `Interview Prep → {Topic Name}`

### `src/pages/BehavioralQuestionsPage.tsx`

**STAR guide** at top — collapsible:
```
Situation — set the context
Task — what you were responsible for
Action — what you did (most important part)
Result — quantified outcome
```

**15 behavioral questions** — hardcode in `src/content/interview/behavioral.json`:
Include Java-engineer-specific answers. Sample questions:
1. Tell me about a time you improved the performance of a system.
2. Describe a situation where you had to refactor legacy code.
3. Tell me about a disagreement with a colleague about a technical decision.
4. Describe how you've mentored a junior developer.
5. Tell me about a production incident you helped resolve.
6. How do you stay current with Java ecosystem changes?
7. Describe a time you had to deliver under a tight deadline.
8. Tell me about a time you advocated for better testing practices.
... (fill to 15)

Each question: expandable model answer (Java-engineer context, uses STAR structure).

---

## Sidebar update
Add "Interview Prep" section to sidebar with links:
- Interview Prep Track (`/interview-prep`)
- Interview Simulation (`/interview-sim`)
- Behavioral Questions (`/interview-prep/behavioral`)

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T27: F5 interview prep UI — checklist, Q&A viewer, behavioral questions`
