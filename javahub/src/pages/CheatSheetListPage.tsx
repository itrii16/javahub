import { Link } from 'react-router-dom'
import { cheatSheets } from '@/content/cheatsheets'

export default function CheatSheetListPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Cheat Sheets</h1>
        <p className="text-gray-400 mt-1">Quick-reference tables for Java topics — printable and copyable.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cheatSheets.map(sheet => (
          <Link
            key={sheet.id}
            to={`/cheatsheets/${sheet.id}`}
            className="bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col gap-3 transition-colors group"
          >
            <div>
              <span className="text-xs text-indigo-400 font-medium uppercase tracking-wide">
                {sheet.topicId.replace(/-/g, ' ')}
              </span>
              <h2 className="text-base font-semibold text-gray-100 mt-1 group-hover:text-indigo-300 transition-colors">
                {sheet.title}
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              {sheet.sections.length} section{sheet.sections.length !== 1 ? 's' : ''}
            </p>
            <span className="mt-auto text-xs text-indigo-500 group-hover:text-indigo-400">
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
