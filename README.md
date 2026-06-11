# JavaHub

A client-side React + TypeScript web app for Java engineers to study, practice, and track their knowledge through structured flashcards and spaced repetition.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v3**
- **React Router v6**
- **Zustand** (localStorage persistence)
- **Prism.js** (Java syntax highlighting)
- **Vitest** + **React Testing Library**

## Getting started

```bash
cd javahub
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
javahub/
├── src/
│   ├── content/         # Topic + card JSON data
│   ├── components/
│   │   ├── layout/      # AppShell, Sidebar, Topbar, Breadcrumb
│   │   ├── cards/       # ContentCard
│   │   └── study/       # FlashCard, RatingBar
│   ├── pages/           # HomePage, TopicPage, CardDetailPage, StudyPage
│   ├── store/           # Zustand store (progress, bookmarks, notes, streak)
│   ├── lib/             # SM-2 spaced repetition algorithm
│   └── types/           # TypeScript interfaces
└── tests/               # Vitest unit tests
```

## Features

- Browse topics grouped by category (Java Core, Data Structures, OOP, …)
- Collapsible sidebar with subtopic navigation
- Per-card difficulty badges (Beginner / Mid / Senior), bookmarks, and notes
- Difficulty filter on topic pages
- Spaced repetition study mode (SM-2 algorithm)
- Streak tracking — all progress persisted to localStorage

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest tests |
| `npm run lint` | ESLint |
