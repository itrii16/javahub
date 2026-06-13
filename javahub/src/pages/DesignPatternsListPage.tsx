import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DesignPattern, PatternCategory } from '@/types'
import patternsData from '@/content/design-patterns/patterns.json'

const patterns = patternsData as DesignPattern[]

const CATEGORIES: Array<PatternCategory | 'All'> = ['All', 'Creational', 'Structural', 'Behavioral']

const CATEGORY_COLORS: Record<PatternCategory, string> = {
  Creational: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Structural: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  Behavioral: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
}

const CATEGORY_TAB_ACTIVE: Record<PatternCategory | 'All', string> = {
  All: 'bg-indigo-500 text-white border-indigo-500',
  Creational: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  Structural: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  Behavioral: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
}

function categoryCount(cat: PatternCategory | 'All'): number {
  if (cat === 'All') return patterns.length
  return patterns.filter(p => p.category === cat).length
}

export function DesignPatternsListPage() {
  const [activeCategory, setActiveCategory] = useState<PatternCategory | 'All'>('All')

  const filtered = activeCategory === 'All'
    ? patterns
    : patterns.filter(p => p.category === activeCategory)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Design Patterns</h1>
        <p className="text-gray-400 text-base">
          15 patterns &middot; GoF reference for Java engineers
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat
          const count = categoryCount(cat)
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isActive
                  ? CATEGORY_TAB_ACTIVE[cat]
                  : 'border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              {cat}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-white/20' : 'bg-gray-800 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(pattern => (
          <div
            key={pattern.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col hover:border-gray-700 transition-colors"
          >
            {/* Category Badge */}
            <span className={`inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${CATEGORY_COLORS[pattern.category]}`}>
              {pattern.category}
            </span>

            {/* Pattern Name */}
            <h2 className="text-gray-100 font-semibold text-lg mb-2 leading-tight">
              {pattern.name}
            </h2>

            {/* Intent — truncated to 2 lines */}
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
              {pattern.intent}
            </p>

            {/* View Link */}
            <Link
              to={`/design-patterns/${pattern.id}`}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors self-start"
            >
              View Pattern &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DesignPatternsListPage
