import { Link, useParams } from 'react-router-dom'
import type { DesignPattern, PatternCategory } from '@/types'
import patternsData from '@/content/design-patterns/patterns.json'

const patterns = patternsData as DesignPattern[]

const CATEGORY_COLORS: Record<PatternCategory, string> = {
  Creational: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Structural: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  Behavioral: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
}

export function DesignPatternPage() {
  const { patternId } = useParams<{ patternId: string }>()
  const pattern = patterns.find(p => p.id === patternId)

  if (!pattern) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg mb-4">Pattern not found.</p>
        <Link
          to="/design-patterns"
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          &larr; All Patterns
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── 1. Header ───────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[pattern.category]}`}>
            {pattern.category}
          </span>
          <Link
            to="/design-patterns"
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            Design Patterns
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-100 mb-3">{pattern.name}</h1>
        <p className="text-gray-300 text-base leading-relaxed">{pattern.intent}</p>
      </div>

      {/* ── 2. When to Use ──────────────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-5">
          <h2 className="text-indigo-300 font-semibold text-sm uppercase tracking-wider mb-2">
            When to Use
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{pattern.whenToUse}</p>
        </div>
      </section>

      {/* ── 3. Participants Table ────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-gray-100 font-semibold text-xl mb-3">Participants</h2>
        <div className="rounded-xl overflow-hidden border border-gray-800">
          <table className="w-full text-sm bg-gray-900">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-gray-400 font-semibold w-1/3">Name</th>
                <th className="text-left px-4 py-3 text-gray-400 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {pattern.participants.map((p, idx) => (
                <tr
                  key={p.name}
                  className={idx < pattern.participants.length - 1 ? 'border-b border-gray-800' : ''}
                >
                  <td className="px-4 py-3 text-indigo-400 font-medium font-mono text-xs align-top pt-4">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm leading-relaxed">{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. Java Example ─────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-gray-100 font-semibold text-xl mb-3">Java Example</h2>
        <div className="rounded-xl bg-gray-950 border border-gray-800 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/50">
            <span className="text-xs text-gray-500 font-medium font-mono">Java</span>
          </div>
          <div className="overflow-x-auto">
            <pre className="px-5 py-4 text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">
              <code>{pattern.javaExample}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── 5. Real-World Java ──────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-gray-100 font-semibold text-xl mb-3">Real-World Java</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{pattern.realWorldJava}</p>
      </section>

      {/* ── 6. Pros & Cons ──────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-gray-100 font-semibold text-xl mb-3">Pros &amp; Cons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pros */}
          <div className="bg-green-950/20 border border-green-800/30 rounded-xl p-5">
            <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-3">
              Pros
            </h3>
            <ul className="space-y-2">
              {pattern.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5 shrink-0">&#10003;</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Cons */}
          <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-5">
            <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">
              Cons
            </h3>
            <ul className="space-y-2">
              {pattern.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-red-400 mt-0.5 shrink-0">&#10007;</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 7. Interview Tips ───────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-gray-100 font-semibold text-xl mb-3">Interview Tips</h2>
        <ul className="space-y-3">
          {pattern.interviewTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
              <span className="text-indigo-400 mt-0.5 shrink-0 text-base leading-none">&#8226;</span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 8. Related Patterns ─────────────────────────────────────────────── */}
      {pattern.relatedPatterns.length > 0 && (
        <section className="mb-10">
          <h2 className="text-gray-100 font-semibold text-xl mb-3">Related Patterns</h2>
          <div className="flex flex-wrap gap-2">
            {pattern.relatedPatterns.map(relId => {
              const rel = patterns.find(p => p.id === relId)
              return (
                <Link
                  key={relId}
                  to={`/design-patterns/${relId}`}
                  className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:text-gray-100 hover:border-gray-500 text-sm transition-colors"
                >
                  {rel ? rel.name : relId}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 9. Bottom Nav ───────────────────────────────────────────────────── */}
      <div className="pt-6 border-t border-gray-800">
        <Link
          to="/design-patterns"
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          &larr; All Patterns
        </Link>
      </div>
    </div>
  )
}

export default DesignPatternPage
