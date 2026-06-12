# T25 — F4: Cheat Sheets (Data + UI)

## Goal
Create the cheat sheet data files and the cheat sheet viewer UI with Copy and Print buttons.

---

## Types — add to `src/types/content.ts`

```ts
export interface CheatSheetRow {
  label: string;
  columns: string[];  // one entry per column header
}

export interface CheatSheetTable {
  headers: string[];
  rows: CheatSheetRow[];
}

export interface CheatSheetSection {
  title: string;
  content?: string;          // markdown prose (optional)
  table?: CheatSheetTable;   // structured table (optional)
  codeExample?: string;      // Java code snippet (optional)
}

export interface CheatSheet {
  id: string;
  title: string;
  topicId: string;           // linked topic (for navigation)
  sections: CheatSheetSection[];
}
```

---

## Content files — `src/content/cheatsheets/`

Create one JSON file per cheat sheet. Minimum viable content per sheet:

### `solid.json`
5 sections, one per principle. Each section: principle name, 1-sentence definition, a bad/good code pair (codeExample field showing violation then fix).

### `java-streams.json`
Sections: Source methods, Intermediate operations, Terminal operations, Collectors reference.
Each as a table: method name | signature | description | example.

### `design-patterns.json`
Table: Pattern | Category | Intent | Java snippet reference | "Use when".

### `collections.json`
Table: Class | Interface | Ordered? | Sorted? | Null keys? | Thread-safe? | Time complexity (get/put/contains).

### `concurrency.json`
Sections: Thread primitives table, Locks table, Concurrent collections table, CompletableFuture methods reference.

### `data-structures-complexity.json`
The Big-O cheat sheet. Table:
- Rows: Array, ArrayList, LinkedList, HashMap, TreeMap, HashSet, TreeSet, PriorityQueue, Stack/Deque
- Columns: Access | Search | Insert | Delete | Space | Java class

### `algorithms-complexity.json`
Sorting algorithms table: Algorithm | Best | Average | Worst | Space | Stable? | In-place? | Notes.
Algorithms: TimSort, Quicksort, Mergesort, Heapsort, Insertion Sort, Counting Sort.

### `gc-comparison.json`
GC table: GC | Java version | Pause type | Best for | Key flags.
Entries: Serial, Parallel, G1, ZGC, Shenandoah.

---

## Routes
- `/cheatsheets` → `CheatSheetListPage` (grid of all cheat sheet cards)
- `/cheatsheets/:id` → `CheatSheetPage` (single sheet viewer)

---

## Components

### `src/pages/CheatSheetListPage.tsx`
- Grid of cheat sheet cards (title, linked topic badge, "View" button)
- Add "Cheat Sheets" link in sidebar navigation (after content topics section)

### `src/pages/CheatSheetPage.tsx`
- Renders each section: prose (`<ReactMarkdown>` or simple `<p>`), table, or code block
- **Copy button**: copies the full cheat sheet as plain text to clipboard (`navigator.clipboard.writeText`)
- **Print button**: `window.print()` — the page layout must look good when printed (no sidebar, full width)
- Back link to `/cheatsheets`

### `src/components/cheatsheets/CheatSheetTable.tsx`
Renders a `CheatSheetTable` as an HTML table with:
- `gray-900` background, `gray-700` borders, `gray-300` header row
- `text-xs` for dense tables, horizontal scroll wrapper for wide tables

---

## Sidebar update
Add "Cheat Sheets" section to sidebar (below topics list), with individual sheet links.

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T25: F4 cheat sheets — 8 sheets, list + viewer pages, copy + print`
