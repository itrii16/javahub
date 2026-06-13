// Minimal markdown-to-HTML renderer: headers, bold, italic, inline code, fenced code, bullets
export function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inCode = false
  let inList = false

  for (const raw of lines) {
    // Fenced code block
    if (raw.trimStart().startsWith('```')) {
      if (inList) { out.push('</ul>'); inList = false }
      if (inCode) { out.push('</code></pre>'); inCode = false }
      else { out.push('<pre class="bg-gray-950 border border-gray-800 rounded-lg p-3 overflow-x-auto text-xs text-green-300 font-mono my-2"><code>'); inCode = true }
      continue
    }
    if (inCode) { out.push(escapeHtml(raw) + '\n'); continue }

    let line = raw

    // Headings
    if (/^### /.test(line)) { if (inList) { out.push('</ul>'); inList = false } out.push(`<h3 class="text-base font-semibold text-gray-200 mt-4 mb-1">${inline(line.slice(4))}</h3>`); continue }
    if (/^## /.test(line))  { if (inList) { out.push('</ul>'); inList = false } out.push(`<h2 class="text-lg font-semibold text-gray-100 mt-5 mb-1">${inline(line.slice(3))}</h2>`); continue }
    if (/^# /.test(line))   { if (inList) { out.push('</ul>'); inList = false } out.push(`<h1 class="text-xl font-bold text-gray-100 mt-6 mb-2">${inline(line.slice(2))}</h1>`); continue }

    // Bullet list
    if (/^[-*] /.test(line)) {
      if (!inList) { out.push('<ul class="list-disc list-inside space-y-1 my-2 text-gray-400 text-sm">'); inList = true }
      out.push(`<li>${inline(line.slice(2))}</li>`)
      continue
    }

    if (inList && line.trim() === '') { out.push('</ul>'); inList = false }

    // Blank line
    if (line.trim() === '') { if (inList) { out.push('</ul>'); inList = false } out.push('<br>'); continue }

    out.push(`<p class="text-sm text-gray-300 leading-relaxed">${inline(line)}</p>`)
  }

  if (inCode) out.push('</code></pre>')
  if (inList) out.push('</ul>')

  return out.join('')
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-green-300 px-1 rounded text-xs font-mono">$1</code>')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
