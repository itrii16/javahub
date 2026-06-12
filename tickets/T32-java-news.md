# T32 — F9: Java News & What's New

## Goal
Build the Java News section: latest release banner, What's New cards per JEP, and the
Java version timeline from Java 8 to current.

---

## Types — add to `src/types/content.ts`

```ts
export type FeatureStatus = 'Preview' | 'Incubating' | 'Finalized';

export interface JepCard {
  jepNumber: number;
  title: string;
  plainEnglishSummary: string;
  codeExample?: string;
  status: FeatureStatus;
  productionSafe: boolean;
  javaVersion: number;
}

export interface JavaRelease {
  version: number;         // e.g. 21
  releaseDate: string;     // ISO date
  isLts: boolean;
  summary: string;         // one-line
  jeps: JepCard[];
  majorFeatures: string[]; // bullet list of headline features
}

export interface JavaTimeline {
  releases: JavaRelease[];
  lastUpdated: string;     // ISO date — shown in UI as "Last updated"
}
```

---

## Content — `src/content/java-news/timeline.json`

Populate a `JavaTimeline` object covering **Java 8 through Java 21** (current LTS).

**Minimum data required per version**:

| Version | LTS | Key features to include |
|---------|-----|------------------------|
| 8  | ✅ | Lambdas, Stream API, Optional, default methods, Date/Time API |
| 9  | — | Modules (JPMS), JShell, collection factory methods |
| 10 | — | var (local type inference) |
| 11 | ✅ | HTTP Client, String methods (isBlank, strip, repeat), running single files |
| 14 | — | Records (preview), Switch expressions (standard) |
| 15 | — | Sealed classes (preview), Text blocks (standard) |
| 16 | — | Records (standard), Pattern matching instanceof (standard) |
| 17 | ✅ | Sealed classes (standard), strong encapsulation of JDK internals |
| 19 | — | Virtual threads (preview / Project Loom) |
| 21 | ✅ | Virtual threads (standard, JEP 444), Record patterns (JEP 440), Pattern matching switch (JEP 441), Sequenced collections (JEP 431) |

For Java 21 specifically, create a full `JepCard` for each of: JEP 444 (Virtual Threads),
JEP 440 (Record Patterns), JEP 441 (Pattern Matching for switch), JEP 431 (Sequenced Collections).

Set `lastUpdated` to `"2025-09-01"`.

---

## Route
`/java-news` → `JavaNewsPage`

---

## Components

### `src/pages/JavaNewsPage.tsx`

**Section 1 — Latest Release Banner**:
- Shows the most recent release (highest version number in timeline)
- Fields: version badge, release date, LTS badge (if applicable), one-line summary
- "Last updated: {lastUpdated}" timestamp in small muted text (right-aligned)

**Section 2 — What's New Cards** (latest release JEPs only):
- Grid of `<JepCard />` components
- Each card: JEP number + title | status badge (Preview/Incubating/Finalized, color coded)
  | "Production safe?" indicator (green ✓ / amber ⚠) | plain-English summary | optional code example

**Section 3 — Version Timeline**:
- Vertical timeline component (oldest → newest, top → bottom)
- Each release: version number (large) | date | LTS badge | bullet list of major features
- LTS releases visually distinguished (indigo accent border)
- "Coming Next" note at bottom: plain text + external link to `https://openjdk.org/jeps/`
  (do not add speculative content — link out only)

### `src/components/news/JepCardComponent.tsx`
Renders a single `JepCard`. Status badge colors:
- Finalized → `green-400`
- Preview → `yellow-400`
- Incubating → `orange-400`

---

## Sidebar update
Add "Java News" link in sidebar (newspaper icon or similar).

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T32: F9 Java news — timeline JSON, What's New cards, version history`
