import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { topics } from '@/content'
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

export default function Sidebar({ onNavigate }: Props) {
  const { topicId } = useParams()
  const grouped = groupTopics()

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
    <nav className="py-3 select-none">
      {Array.from(grouped.entries()).map(([group, groupTopics]) => {
        if (groupTopics.length === 0) return null
        return (
          <div key={group} className="mb-5">
            <p className="px-4 mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600">
              {group}
            </p>
            {groupTopics.map(topic => {
              const isActive = topic.id === topicId
              const isExpanded = expanded.has(topic.id)

              return (
                <div key={topic.id}>
                  <div className="flex items-center group">
                    <Link
                      to={`/topic/${topic.id}`}
                      onClick={onNavigate}
                      className={`flex-1 px-4 py-1.5 text-sm truncate transition-colors ${
                        isActive
                          ? 'text-gray-100 font-medium'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {topic.title}
                    </Link>
                    {topic.subtopics.length > 1 && (
                      <button
                        onClick={() => toggle(topic.id)}
                        className="pr-4 pl-1 py-1.5 text-gray-600 hover:text-gray-400 transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronIcon open={isExpanded} />
                      </button>
                    )}
                  </div>
                  {isExpanded && topic.subtopics.map(sub => (
                    <Link
                      key={sub.id}
                      to={`/topic/${topic.id}#${sub.id}`}
                      onClick={onNavigate}
                      className="block pl-7 pr-4 py-1 text-xs text-gray-600 hover:text-gray-400 transition-colors truncate"
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

      <div className="mb-5">
        <p className="px-4 mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600">
          Reference
        </p>
        <Link
          to="/cheatsheets"
          onClick={onNavigate}
          className="block px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Cheat Sheets
        </Link>
      </div>

      <div className="mb-5">
        <p className="px-4 mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600">
          Interview
        </p>
        <Link
          to="/interview-prep"
          onClick={onNavigate}
          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          Prep Track
        </Link>
        <Link
          to="/interview-sim"
          onClick={onNavigate}
          className="block px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Interview Simulation
        </Link>
        <Link
          to="/interview-prep/behavioral"
          onClick={onNavigate}
          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          Behavioral Questions
        </Link>
        <Link
          to="/interview-prep/system-design"
          onClick={onNavigate}
          className="block px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          System Design
        </Link>
        <Link
          to="/assessment"
          onClick={onNavigate}
          className="block px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Skill Assessment
        </Link>
      </div>
    </nav>
  )
}
