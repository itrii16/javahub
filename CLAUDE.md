# JavaHub — Claude Code Autonomous Build Instructions

## What this project is
A client-side React + TypeScript web app for Java engineers to study, practice, and track their knowledge. No backend except optional Supabase sync (later phase). Fully deployable to GitHub Pages or Vercel.

## Your job
Work through the tickets in `tickets/` in numeric order. For each ticket:
1. Read the ticket file fully before writing any code
2. Implement everything described — no skipping, no placeholders
3. Write a basic smoke test or Vitest unit test where indicated
4. `git add -A && git commit -m "<ticket-id>: <short description>"` after each ticket
5. Move to the next ticket immediately — do not stop between tickets

Do not ask for confirmation. Do not leave TODOs. Do not create placeholder components. If a decision is ambiguous, pick the most reasonable option and document it in a `DECISIONS.md` file at the project root.

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

---

## Tech stack
- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v3** (no Tailwind plugins needed for Phase 1)
- **React Router v6** (createBrowserRouter)
- **Zustand** (with persist middleware → localStorage)
- **Prism.js** (Java syntax highlighting)
- **Vitest** + **React Testing Library** (tests)

## Project structure to create
```
javahub/
├── CLAUDE.md                  ← this file (copy here too)
├── DECISIONS.md               ← created by Claude Code as needed
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
│   │   └── content.ts         ← T02
│   ├── content/
│   │   └── topics/            ← T03 (one JSON file per topic)
│   ├── store/
│   │   └── useAppStore.ts     ← T04
│   ├── lib/
│   │   └── sm2.ts             ← T10 (pure SM-2 logic)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx   ← T05
│   │   │   ├── Sidebar.tsx    ← T06
│   │   │   ├── Topbar.tsx     ← T05
│   │   │   └── Breadcrumb.tsx ← T05
│   │   ├── cards/
│   │   │   └── ContentCard.tsx ← T07
│   │   └── study/
│   │       ├── FlashCard.tsx  ← T11
│   │       └── RatingBar.tsx  ← T11
│   └── pages/
│       ├── HomePage.tsx       ← T15
│       ├── TopicPage.tsx      ← T08
│       ├── CardDetailPage.tsx ← T09
│       └── StudyPage.tsx      ← T11
└── tests/
    └── sm2.test.ts            ← T10
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
