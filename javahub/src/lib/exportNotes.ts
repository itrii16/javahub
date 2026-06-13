export function buildMarkdownExport(
  notes: Record<string, string>,
  cardResolver: (cardId: string) => { title: string; topicId: string } | null
): string {
  const lines: string[] = [
    '# JavaHub Notes Export',
    `_Exported: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}_`,
    '',
  ]

  for (const [cardId, note] of Object.entries(notes)) {
    if (!note.trim()) continue
    const card = cardResolver(cardId)
    if (!card) continue

    lines.push(`## ${card.title} (${card.topicId})`)
    lines.push('')
    lines.push(note.trim())
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

export function downloadMarkdown(content: string, filename = 'javahub-notes.md') {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
