# JavaHub — Claude Code Autonomous Build Instructions

## What this project is
A client-side React + TypeScript web app for Java engineers to study, practice, and track their knowledge. No backend except optional Supabase sync (later phase). Fully deployable to GitHub Pages or Vercel.

## Your job
Work through the tickets in `tickets/` in numeric order. For each ticket:
1. Read the ticket file fully before writing any code
2. Implement everything described — no skipping, no placeholders
3. Write a basic smoke test or Vitest unit test where indicated
4. `git add -A && git commit -m "<ticket-id>: <short description>"` after each ticket
5. **Update the "Feature & Ticket Status" table below** — mark the ticket as ✅ Done before moving on
6. Move to the next ticket immediately — do not stop between tickets

Do not ask for confirmation. Do not leave TODOs. Do not create placeholder components. If a decision is ambiguous, pick the most reasonable option and document it in a `DECISIONS.md` file at the project root.

---

## Feature & Ticket Status

> **Keep this table current.** After completing each ticket, change its status from ⬜ Pending to ✅ Done.
> This is the single source of truth for what has been built and what remains.

### F1 — Content Library (Phase 1)
| Ticket | Description | Status |
|--------|-------------|--------|
| T01 | Vite + React + TS + Tailwind + Router scaffold | ✅ Done |
| T02 | TypeScript types + JSON content schema | ✅ Done |
| T03 | Seed 3 topics × 5 cards (java-core, data-structures, oop) | ✅ Done |
| T04 | Zustand store with localStorage persistence | ✅ Done |
| T05 | App shell: sidebar, topbar, breadcrumb, routing | ✅ Done |
| T06 | Collapsible topic/subtopic sidebar navigation | ✅ Done |
| T07 | ContentCard component with all fields | ✅ Done |
| T08 | Topic page: card grid, difficulty filter, last visited | ✅ Done |
| T09 | Card detail view: full content, notes, bookmark | ✅ Done |

### F2 — Study Mode / Flashcards (Phase 1)
| Ticket | Description | Status |
|--------|-------------|--------|
| T10 | SM-2 spaced repetition engine (pure logic, tested) | ✅ Done |
| T11 | Flashcard study UI: flip, rate 1–5, session queue | ✅ Done |
| T12 | "Teach it back" mode toggle in study session | ✅ Done |
| T13 | End-of-session summary screen | ✅ Done |

### F1 — Guided Path + Homepage (Phase 1)
| Ticket | Description | Status |
|--------|-------------|--------|
| T14 | Guided path mode: lock Senior cards until Beginner/Mid mastered | ✅ Done |
| T15 | Homepage: last visited, due cards today, streak (basic version) | ✅ Done |

### Content — Missing Topics (all 21 topics)
| Ticket | Description | Status |
|--------|-------------|--------|
| T16 | Seed Java Core remaining topics (Collections, Concurrency, JVM, Generics, Javadoc) | ✅ Done |
| T17 | Seed Engineering Principles (SOLID, Clean Code, Patterns, Refactoring, Testing) | ✅ Done |
| T18 | Seed Architecture & Design (API, Arch Patterns, DB, Distributed, Security, Logging) | ✅ Done |
| T19 | Seed Interview remaining (Algorithms in Java, System Design patterns) | ✅ Done |

### F0 — Initial Assessment (Phase 2)
| Ticket | Description | Status |
|--------|-------------|--------|
| T20 | Assessment question bank: types, 30+ questions, store slice | ✅ Done |
| T21 | Assessment quiz UI: adaptive flow, question card, skip option | ✅ Done |
| T22 | Skill radar chart (Recharts), score computation, study plan results page | ✅ Done |

### F3 — Quiz / Practice Mode (Phase 3)
| Ticket | Description | Status |
|--------|-------------|--------|
| T23 | Per-topic quiz UI: question flow, immediate feedback, results page | ⬜ Pending |
| T24 | Interview simulation mode: timed 30Q quiz, results, PDF print report | ⬜ Pending |

### F4 — Cheat Sheets (Phase 3)
| Ticket | Description | Status |
|--------|-------------|--------|
| T25 | Cheat sheets: 8 sheets (data + UI), copy + print buttons | ⬜ Pending |

### F5 — Interview Prep Track (Phase 1.5 + Phase 5)
| Ticket | Description | Status |
|--------|-------------|--------|
| T26 | Interview Q&A content: types, 32+ questions across 4 topic groups | ⬜ Pending |
| T27 | Interview prep UI: checklist, Q&A viewer, behavioral questions | ⬜ Pending |
| T28 | System design section: 6 classic designs, interactive SVG diagram component | ⬜ Pending |

### F6 — Full Progress Dashboard (Phase 5)
| Ticket | Description | Status |
|--------|-------------|--------|
| T29 | Full dashboard: radar chart, quiz history chart, study plan progress, sync nudge | ⬜ Pending |

### F7 — Search (Phase 6)
| Ticket | Description | Status |
|--------|-------------|--------|
| T30 | Cmd+K full-text search: modal, index, grouped results, recent searches | ⬜ Pending |

### F8 — Bookmarks & Notes (Phase 6)
| Ticket | Description | Status |
|--------|-------------|--------|
| T31 | Bookmarks page, markdown notes, export to .md | ⬜ Pending |

### F9 — Java News (Phase 4)
| Ticket | Description | Status |
|--------|-------------|--------|
| T32 | Java news: timeline JSON (Java 8–21), What's New cards, version history page | ⬜ Pending |

---

## Current project state (as of last update)

**Built & working** (T01–T15):
- Full app scaffold with Vite, React 18, TypeScript, Tailwind CSS, React Router v6
- Zustand store persisted to localStorage
- App shell: sidebar (collapsible), topbar, breadcrumb
- Content library browsable for 3 topics: `java-core`, `data-structures`, `oop`
- Card detail page with notes and bookmark toggle
- SM-2 spaced repetition engine with Vitest tests
- Flashcard study mode with flip UI, 1–5 rating, "teach it back" mode, session summary
- Guided path mode (Senior cards locked until Beginner/Mid mastered)
- Basic homepage with streak, last visited, due cards today

**All 21 topics seeded** ✅ — T16 (Java Core), T17 (Engineering Principles), T18 (Architecture & Design), T19 (Algorithms, System Design). Content library is complete.

**Not yet built** (T16–T32):
- 18 missing topic JSON files (T16–T19)
- F0: Assessment quiz, skill radar chart, study plan (T20–T22)
- F3: Per-topic quizzes, interview simulation, PDF report (T23–T24)
- F4: Cheat sheets (T25)
- F5: Interview Q&A, prep track UI, system design (T26–T28)
- F6: Full dashboard with charts (T29)
- F7: Search (T30)
- F8: Bookmarks page + notes export (T31)
- F9: Java News section (T32)

---

## Ticket execution order

| Order | File | Description |
|-------|------|-------------|
| 1 | `tickets/T01-project-scaffold.md` | Vite + React + TS + Tailwind + Router setup |
| 2 | `tickets/T02-content-schema.md` | TypeScript types + JSON content schema |
| 3 | `tickets/T03-seed-content.md` | Seed 3 topics × 5 cards of real content |
| 4 | `tickets/T04-zustand-store.md` | Global state store with localStorage persistence |
| 5 | `tickets/T05-layout-shell.md` | App shell: sidebar, topbar, breadcrumb, routing |
| 6 | `tickets/T06-topic-sidebar.md` | Collapsible topic/subtopic sidebar navigation |
| 7 | `tickets/T07-content-card.md` | ContentCard component with all fields |
| 8 | `tickets/T08-topic-page.md` | Topic page: card grid, difficulty filter, last visited |
| 9 | `tickets/T09-card-detail.md` | Card detail view: full content, notes, bookmark |
| 10 | `tickets/T10-flashcard-engine.md` | SM-2 spaced repetition engine (pure logic, tested) |
| 11 | `tickets/T11-study-mode.md` | Flashcard study UI: flip, rate 1-5, session queue |
| 12 | `tickets/T12-teach-it-back.md` | "Teach it back" mode toggle in study session |
| 13 | `tickets/T13-session-summary.md` | End-of-session summary screen |
| 14 | `tickets/T14-guided-path.md` | Guided path mode: lock Senior cards until Beginner/Mid mastered |
| 15 | `tickets/T15-homepage.md` | Homepage: last visited, due cards today, streak |
| 16 | `tickets/T16-seed-java-core-remaining.md` | Seed remaining Java Core topics |
| 17 | `tickets/T17-seed-engineering-principles.md` | Seed Engineering Principles topics |
| 18 | `tickets/T18-seed-architecture-topics.md` | Seed Architecture & Design topics |
| 19 | `tickets/T19-seed-interview-algorithms.md` | Seed Interview remaining topics |
| 20 | `tickets/T20-assessment-question-bank.md` | F0: Assessment question bank |
| 21 | `tickets/T21-assessment-quiz-ui.md` | F0: Assessment quiz UI (adaptive flow) |
| 22 | `tickets/T22-skill-radar-chart.md` | F0: Skill radar chart + study plan results |
| 23 | `tickets/T23-per-topic-quiz.md` | F3: Per-topic quiz UI |
| 24 | `tickets/T24-interview-simulation.md` | F3: Interview simulation mode + PDF report |
| 25 | `tickets/T25-cheat-sheets.md` | F4: Cheat sheets (data + UI) |
| 26 | `tickets/T26-interview-qa-content.md` | F5: Interview Q&A content |
| 27 | `tickets/T27-interview-prep-ui.md` | F5: Interview prep track UI |
| 28 | `tickets/T28-system-design-section.md` | F5: System design section |
| 29 | `tickets/T29-full-dashboard.md` | F6: Full progress dashboard |
| 30 | `tickets/T30-search.md` | F7: Full-text search (Cmd+K) |
| 31 | `tickets/T31-bookmarks-notes.md` | F8: Bookmarks page + notes export |
| 32 | `tickets/T32-java-news.md` | F9: Java News section |

---

## Tech stack
- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v3** (no Tailwind plugins needed for Phase 1)
- **React Router v6** (createBrowserRouter)
- **Zustand** (with persist middleware → localStorage)
- **Recharts** (radar chart, bar/line charts — install when needed in T22)
- **Prism.js** (Java syntax highlighting)
- **Vitest** + **React Testing Library** (tests)

## Project structure
```
javahub/
├── CLAUDE.md                          ← this file — keep Feature Status table updated
├── DECISIONS.md
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── types/
│   │   └── content.ts                 ← T02 + extended by T20, T25, T26, T28, T32
│   ├── content/
│   │   ├── topics/                    ← T03, T16–T19 (21 JSON files total)
│   │   ├── assessment/
│   │   │   └── questions.json         ← T20
│   │   ├── cheatsheets/               ← T25 (8 JSON files)
│   │   ├── interview/                 ← T26, T27 (4 Q&A files + behavioral.json)
│   │   ├── systemdesign/              ← T28 (6 JSON files)
│   │   └── java-news/
│   │       └── timeline.json          ← T32
│   ├── store/
│   │   └── useAppStore.ts             ← T04 + extended by T20, T22, T23, T24, T27, T29
│   ├── lib/
│   │   ├── sm2.ts                     ← T10
│   │   ├── assessmentSampler.ts       ← T21
│   │   ├── scoreCalculator.ts         ← T22
│   │   ├── simSampler.ts              ← T24
│   │   ├── searchIndex.ts             ← T30
│   │   ├── exportNotes.ts             ← T31
│   │   └── pdfReport.ts               ← T24
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx           ← T05
│   │   │   ├── Sidebar.tsx            ← T06
│   │   │   ├── Topbar.tsx             ← T05
│   │   │   └── Breadcrumb.tsx         ← T05
│   │   ├── cards/
│   │   │   └── ContentCard.tsx        ← T07
│   │   ├── study/
│   │   │   ├── FlashCard.tsx          ← T11
│   │   │   └── RatingBar.tsx          ← T11
│   │   ├── assessment/
│   │   │   ├── QuizQuestionCard.tsx   ← T21
│   │   │   └── AssessmentComplete.tsx ← T21
│   │   ├── cheatsheets/
│   │   │   └── CheatSheetTable.tsx    ← T25
│   │   ├── dashboard/
│   │   │   └── SkillRadarChart.tsx    ← T22, T29
│   │   ├── search/
│   │   │   ├── SearchModal.tsx        ← T30
│   │   │   └── SearchTrigger.tsx      ← T30
│   │   ├── news/
│   │   │   └── JepCardComponent.tsx   ← T32
│   │   └── systemdesign/
│   │       └── DesignDiagram.tsx      ← T28
│   └── pages/
│       ├── HomePage.tsx               ← T15, upgraded T29
│       ├── TopicPage.tsx              ← T08
│       ├── CardDetailPage.tsx         ← T09
│       ├── StudyPage.tsx              ← T11
│       ├── SessionSummaryPage.tsx     ← T13
│       ├── AssessmentPage.tsx         ← T21
│       ├── AssessmentResultsPage.tsx  ← T22
│       ├── QuizPage.tsx               ← T23
│       ├── QuizResultsPage.tsx        ← T23
│       ├── InterviewSimPage.tsx       ← T24
│       ├── InterviewSimResultsPage.tsx← T24
│       ├── CheatSheetListPage.tsx     ← T25
│       ├── CheatSheetPage.tsx         ← T25
│       ├── InterviewPrepPage.tsx      ← T27
│       ├── InterviewPrepTopicPage.tsx ← T27
│       ├── BehavioralQuestionsPage.tsx← T27
│       ├── SystemDesignListPage.tsx   ← T28
│       ├── SystemDesignPage.tsx       ← T28
│       ├── BookmarksPage.tsx          ← T31
│       └── JavaNewsPage.tsx           ← T32
└── tests/
    ├── sm2.test.ts                    ← T10
    ├── assessmentSampler.test.ts      ← T21
    ├── scoreCalculator.test.ts        ← T22
    ├── simSampler.test.ts             ← T24
    ├── searchIndex.test.ts            ← T30
    └── exportNotes.test.ts            ← T31
```

## Design system
- Background: `gray-950`, surface cards: `gray-900`, borders: `gray-800`
- Accent: `indigo-500` (interactive elements, active states)
- Text: `gray-100` (primary), `gray-400` (secondary/muted)
- Difficulty colors: `green-400` (Beginner), `yellow-400` (Mid), `red-400` (Senior)
- Font: system-ui stack (no Google Fonts import needed)
- Rounded corners: `rounded-xl` for cards, `rounded-lg` for buttons
- Hover states on all interactive elements

## Coding conventions
- All components: functional, TypeScript, named exports
- No `any` types — define proper interfaces in `src/types/`
- Zustand store: one file, typed slices, persist to localStorage
- CSS: Tailwind utility classes only, no custom CSS files
- Imports: absolute paths via `@/` alias (configure in vite.config.ts and tsconfig.json)
- Commits: one per ticket, format `T01: scaffold vite + react + tailwind`
