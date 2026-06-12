import { useParams, Link } from 'react-router-dom'
import { cheatSheetMap } from '@/content/cheatsheets'
import { CheatSheetTable } from '@/components/cheatsheets/CheatSheetTable'

function sheetToPlainText(id: string): string {
  const sheet = cheatSheetMap[id]
  if (!sheet) return ''
  const lines: string[] = [`# ${sheet.title}`, '']
  for (const section of sheet.sections) {
    lines.push(`## ${section.title}`)
    if (section.content) lines.push(section.content, '')
    if (section.table) {
      lines.push(section.table.headers.join(' | '))
      lines.push(section.table.headers.map(() => '---').join(' | '))
      for (const row of section.table.rows) {
        lines.push([row.label, ...row.columns].join(' | '))
      }
      lines.push('')
    }
    if (section.codeExample) {
      lines.push('```java', section.codeExample, '```', '')
    }
  }
  return lines.join('\n')
}

export default function CheatSheetPage() {
  const { id } = useParams<{ id: string }>()
  const sheet = id ? cheatSheetMap[id] : null

  if (!sheet) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-4">Cheat sheet not found.</p>
        <Link to="/cheatsheets" className="text-indigo-400 hover:text-indigo-300">← Back to cheat sheets</Link>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sheetToPlainText(sheet.id))
  }

  return (
    <div className="max-w-4xl mx-auto print:max-w-none">
      {/* Header (hidden when printing) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link to="/cheatsheets" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Cheat Sheets
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-1">
          {sheet.topicId.replace(/-/g, ' ')}
        </p>
        <h1 className="text-2xl font-bold text-gray-100">{sheet.title}</h1>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sheet.sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800 pb-2">
              {section.title}
            </h2>
            {section.content && (
              <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
            )}
            {section.table && <CheatSheetTable table={section.table} />}
            {section.codeExample && (
              <pre className="bg-gray-950 border border-gray-800 rounded-xl p-4 overflow-x-auto text-sm">
                <code className="language-java text-gray-300">{section.codeExample}</code>
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
        JavaHub — {sheet.title} — printed {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}
