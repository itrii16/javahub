import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { systemDesignMap } from '@/content/systemdesign'
import DesignDiagram from '@/components/systemdesign/DesignDiagram'

export default function SystemDesignPage() {
  const { designId } = useParams<{ designId: string }>()
  const design = designId ? systemDesignMap[designId] : null
  const [openBreakdown, setOpenBreakdown] = useState<string | null>(null)

  if (!design) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="mb-4">Design not found.</p>
        <Link to="/interview-prep/system-design" className="text-indigo-400 hover:text-indigo-300">← System Design</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/interview-prep" className="hover:text-gray-300 transition-colors">Interview Prep</Link>
        <span>›</span>
        <Link to="/interview-prep/system-design" className="hover:text-gray-300 transition-colors">System Design</Link>
        <span>›</span>
        <span className="text-gray-300">{design.title}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">{design.title}</h1>
        <p className="text-gray-400 mt-2 leading-relaxed">{design.description}</p>
      </div>

      {/* Requirements */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Functional Requirements</h2>
          <ul className="space-y-1.5">
            {design.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-indigo-400 flex-shrink-0 mt-0.5">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Non-Functional Requirements</h2>
          <ul className="space-y-1.5">
            {design.nonFunctionalReqs.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-yellow-500 flex-shrink-0 mt-0.5">◈</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Architecture Diagram</h2>
        <p className="text-xs text-gray-600 mb-3">Click any component to see Java implementation notes</p>
        <DesignDiagram components={design.components} connections={design.connections} />
      </div>

      {/* Component Breakdown */}
      {design.componentBreakdown.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Component Breakdown</h2>
          <div className="space-y-2">
            {design.componentBreakdown.map(item => {
              const isOpen = openBreakdown === item.componentId
              return (
                <div key={item.componentId} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenBreakdown(isOpen ? null : item.componentId)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-medium text-gray-200 text-sm">{item.heading}</span>
                    <span className="text-gray-600 text-xs">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-800 p-5 space-y-4">
                      <p className="text-sm text-gray-400 leading-relaxed">{item.detail}</p>
                      {item.javaImpl && (
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Java Implementation</p>
                          <pre className="text-xs text-green-300 bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto leading-relaxed font-mono whitespace-pre">
                            {item.javaImpl}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer nav */}
      <div className="flex gap-3 pt-2">
        <Link
          to="/interview-prep/system-design"
          className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
        >
          ← All Designs
        </Link>
        <Link
          to="/interview-sim"
          className="px-4 py-2 text-sm border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-indigo-300 rounded-lg transition-colors"
        >
          Interview Sim →
        </Link>
      </div>
    </div>
  )
}
