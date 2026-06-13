import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { topics } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import type { TopicGroup } from '@/types'

const GROUP_ORDER: TopicGroup[] = [
  'Java Core',
  'Engineering Principles',
  'Architecture & Design',
  'Data Structures',
  'Algorithms',
  'Interview & System Design',
]

function groupTopics() {
  const map = new Map<TopicGroup, typeof topics>()
  for (const group of GROUP_ORDER) {
    map.set(group, topics.filter(t => t.group === group))
  }
  return map
}

interface Props {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: Props) {
  const { topicId } = useParams()
  const grouped = groupTopics()
  const quizHistory = useAppStore(s => s.quizHistory)

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(topicId ? [topicId] : [])
  )

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <nav className="py-4">
      {Array.from(grouped.entries()).map(([group, groupTopics]) => {
        if (groupTopics.length === 0) return null
        return (
          <div key={group} className="mb-4">
            <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
              {group}
            </p>
            {groupTopics.map(topic => {
              const isActive = topic.id === topicId
              const isExpanded = expanded.has(topic.id)

              return (
                <div key={topic.id}>
                  <div className="flex items-center">
                    <Link
                      to={`/topic/${topic.id}`}
                      onClick={onNavigate}
                      className={`flex-1 px-4 py-2.5 text-sm transition-colors truncate flex items-center justify-between gap-2 ${
                        isActive
                          ? 'text-indigo-400 bg-indigo-500/10 font-medium'
                          : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                      }`}
                    >
                      <span className="truncate">{topic.title}</span>
                      {(() => {
                        const attempts = quizHistory[topic.id]
                        if (!attempts?.length) return null
                        const best = Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100)))
                        return (
                          <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono ${
                            best >= 70 ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                          }`}>{best}%</span>
                        )
                      })()}
                    </Link>
                    {topic.subtopics.length > 1 && (
                      <button
                        onClick={() => toggle(topic.id)}
                        className="px-3 py-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <span className={`text-xs transition-transform inline-block ${isExpanded ? 'rotate-90' : ''}`}>
                          ▶
                        </span>
                      </button>
                    )}
                  </div>
                  {isExpanded && topic.subtopics.map(sub => (
                    <Link
                      key={sub.id}
                      to={`/topic/${topic.id}#${sub.id}`}
                      onClick={onNavigate}
                      className="block pl-8 pr-4 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors truncate"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Cheat Sheets section */}
      <div className="mb-4 mt-2">
        <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Reference
        </p>
        <Link
          to="/cheatsheets"
          onClick={onNavigate}
          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          Cheat Sheets
        </Link>
      </div>

      {/* Interview Prep section */}
      <div className="mb-4 mt-2">
        <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Interview Prep
        </p>
        <Link
          to="/interview-sim"
          onClick={onNavigate}
          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          Interview Simulation
        </Link>
        <Link
          to="/assessment"
          onClick={onNavigate}
          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          Skill Assessment
        </Link>
      </div>
    </nav>
  )
}
