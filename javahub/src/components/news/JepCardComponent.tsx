import { useState } from 'react'
import type { JepCard } from '@/types/content'

const STATUS_COLOR: Record<string, string> = {
  Finalized:  'text-green-400 bg-green-900/20 border-green-800/40',
  Preview:    'text-yellow-400 bg-yellow-900/20 border-yellow-800/40',
  Incubating: 'text-orange-400 bg-orange-900/20 border-orange-800/40',
}

interface Props {
  jep: JepCard
}

export default function JepCardComponent({ jep }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono text-gray-600">JEP {jep.jepNumber}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[jep.status]}`}>
              {jep.status}
            </span>
            {jep.productionSafe ? (
              <span className="text-[10px] text-green-400">✓ Production safe</span>
            ) : (
              <span className="text-[10px] text-amber-500">⚠ Not production safe</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-100">{jep.title}</h3>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-400 leading-relaxed">{jep.plainEnglishSummary}</p>

      {/* Code example */}
      {jep.codeExample && (
        <div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {expanded ? '▲ Hide example' : '▼ Show code example'}
          </button>
          {expanded && (
            <pre className="mt-2 text-xs text-green-300 bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto leading-relaxed font-mono whitespace-pre">
              {jep.codeExample}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
