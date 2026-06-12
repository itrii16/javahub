# T31 — F8: Bookmarks & Notes

## Goal
Make bookmarks and personal notes fully functional: bookmark any card or cheat sheet,
add/edit markdown notes on any card, dedicated "My Bookmarks" page, and Markdown export.

---

## Current state
T09 (`CardDetailPage`) already has a bookmark button and notes field wired to the store.
This ticket ensures the store is complete, adds the bookmarks page, and adds export.

---

## Store — verify & complete `src/store/useAppStore.ts`

Confirm these are implemented (add if missing from T04/T09):
```ts
bookmarks: string[];                        // cardId[]
notes: Record<string, string>;             // cardId → markdown string

toggleBookmark: (cardId: string) => void;
isBookmarked: (cardId: string) => boolean;
setNote: (cardId: string, note: string) => void;
getNote: (cardId: string) => string;
```

---

## Components

### `src/pages/BookmarksPage.tsx`
Route: `/bookmarks`

**Bookmarked cards section**:
- Grid of `<ContentCard />` components for all bookmarked card IDs
- Resolve card objects by searching all topic JSON files
- Empty state: "No bookmarks yet — star a card to save it here"
- Each card has an active bookmark icon (click to remove)

**Notes section**:
- List of cards that have notes (non-empty `notes[cardId]`)
- Each entry: card title | topic badge | note preview (first 100 chars)
- Click → navigate to `CardDetailPage` for that card
- Empty state: "No notes yet — add notes on any card"

**Export button**:
- "Export notes as Markdown" → triggers download of a `.md` file
- Format:
  ```markdown
  # JavaHub Notes Export
  _Exported: {date}_

  ## {Card Title} ({Topic Name})
  {note content}

  ---
  ```
- Use `src/lib/exportNotes.ts` — pure function, no dependencies

### `src/lib/exportNotes.ts`
```ts
export function buildMarkdownExport(
  notes: Record<string, string>,
  cardResolver: (cardId: string) => { title: string; topicId: string } | null
): string
```

---

## CardDetailPage updates (T09)
If notes textarea is not already using a markdown preview toggle, add one:
- Two tabs: "Edit" | "Preview" (render markdown as HTML using a simple renderer)
- Use `src/lib/renderMarkdown.ts` — a minimal renderer that handles: headers, bold, italic, code (inline + block), bullet lists. No external markdown library needed for this scope; use a small hand-rolled function OR if complexity warrants it, add `marked` (lightweight, ~5KB).

---

## Sidebar update
Add "Bookmarks" link in sidebar (star icon).

---

## Test
Add `tests/exportNotes.test.ts`:
- `buildMarkdownExport` with 2 notes produces correct markdown structure
- Empty notes object returns only the header
- Cards with null resolver (deleted card) are skipped gracefully

## Commit
`T31: F8 bookmarks & notes — bookmarks page, markdown notes, export to .md`
