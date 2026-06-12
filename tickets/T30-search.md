# T30 — F7: Full-Text Search

## Goal
Implement Cmd/Ctrl+K search across all cards, cheat sheets, and interview Q&As.
Results grouped by type, recent searches stored locally, topic + difficulty filters.

---

## Search index — `src/lib/searchIndex.ts`

Build a flat, in-memory search index at startup (no external library needed for this volume):

```ts
export interface SearchResult {
  id: string;
  type: 'card' | 'cheatsheet' | 'interview-qa';
  title: string;
  topicId: string;
  subtopicId?: string;
  difficulty?: 'Beginner' | 'Mid' | 'Senior';
  snippet: string;    // first 120 chars of matched text
  url: string;        // navigation target
  score: number;      // relevance (title match > body match)
}

export function buildSearchIndex(): SearchResult[]
// Indexes: all cards (title + explanation + gotcha), all cheat sheet sections,
// all interview Q&A questions + answer summaries

export function search(
  query: string,
  index: SearchResult[],
  filters?: { topicId?: string; difficulty?: string; type?: string }
): SearchResult[]
// Simple substring match on title (score 2) and body (score 1)
// Returns results sorted by score desc, max 50 results
```

Build the index once in `src/App.tsx` (or a context) using `useMemo` so it doesn't rebuild on every render.

---

## Components

### `src/components/search/SearchModal.tsx`
Full-screen overlay modal (not a dropdown):
- Keyboard shortcut `Cmd+K` / `Ctrl+K` opens it (listener in `App.tsx`)
- `Escape` closes it
- Autofocused `<input>` at top: "Search cards, cheat sheets, Q&As..."
- Results appear as user types (debounced 150ms)
- **No results state**: "No results for '{query}'" + suggested searches

**Results layout**:
- Grouped by type: "Content Cards (5)", "Cheat Sheets (2)", "Interview Q&As (3)"
- Each result: title | topic chip | difficulty badge | snippet
- Keyboard navigation: Arrow keys to move selection, Enter to navigate
- Click or Enter → close modal and navigate to result URL

**Filters bar** (shown when results exist):
- Topic filter: `<select>` (All topics + 21 topic options)
- Difficulty filter: All / Beginner / Mid / Senior
- Type filter: All / Cards / Cheat Sheets / Q&As

**Recent searches**:
- Shown when input is empty
- Last 8 searches, stored in `store.searchHistory`
- Click to re-run; "✕" to remove individual item

### `src/components/search/SearchTrigger.tsx`
Button in `Topbar.tsx`: "Search… ⌘K" — clicking opens the modal.

---

## Store update
```ts
searchHistory: string[];  // already in T04 store spec, confirm it's implemented
addSearchHistory: (query: string) => void;
clearSearchHistory: () => void;
```

---

## Routing
No new route — search is a modal overlay on any page.
Add `<SearchModal />` to `AppShell.tsx` (always mounted, shown/hidden via state).

---

## Test
Add `tests/searchIndex.test.ts`:
- `search('HashMap', index)` returns results with 'HashMap' in title first
- `search('xyz_nonexistent_term', index)` returns empty array
- Filter by difficulty='Senior' excludes Beginner/Mid results
- `buildSearchIndex()` returns > 0 results (sanity check)

## Commit
`T30: F7 search — Cmd+K modal, full-text index, grouped results, recent searches`
