import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { topics } from '@/content'
import type { PrepStatus, TopicGroup } from '@/types'

const STATUS_CYCLE: PrepStatus[] = ['not-started', 'in-progress', 'ready']
const STATUS_LABEL: Record<PrepStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'ready': 'Ready',
}
const STATUS_COLOR: Record<PrepStatus, string> = {
  'not-started': 'text-gray-500 bg-gray-800',
  'in-progress': 'text-yellow-400 bg-yellow-900/20',
  'ready': 'text-green-400 bg-green-900/20',
}

const GROUP_ORDER: TopicGroup[] = [
  'Java Core',
  'Engineering Principles',
  'Architecture & Design',
  'Data Structures',
  'Algorithms',
  'Interview & System Design',
]

export default function InterviewPrepPage() {
  const interviewPrepStatus = useAppStore(s => s.interviewPrepStatus)
  const setPrepStatus = useAppStore(s => s.setPrepStatus)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggle = (group: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })
  }

  const cycleStatus = (topicId: string) => {
    const current = interviewPrepStatus[topicId] ?? 'not-started'
    const idx = STATUS_CYCLE.indexOf(current)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    setPrepStatus(topicId, next)
  }

  const readyCount = topics.filter(t => (interviewPrepStatus[t.id] ?? 'not-started') === 'ready').length
  const remainingMinutes = topics
    .filter(t => (interviewPrepStatus[t.id] ?? 'not-started') !== 'ready')
    .reduce((acc, t) => acc + t.estimatedMinutes, 0)

  const grouped = new Map<TopicGroup, typeof topics>()
  for (const g of GROUP_ORDER) grouped.set(g, topics.filter(t => t.group === g))

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-100">Interview Prep Track</h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <span>
            <span className="text-green-400 font-semibold">{readyCount}</span> / {topics.length} topics ready
          </span>
          <span>~{Math.ceil(remainingMinutes / 60)}h remaining</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((readyCount / topics.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          to="/interview-sim"
          className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl transition-colors"
        >
          <span className="text-2xl">⏱</span>
          <div>
            <p className="text-sm font-medium text-gray-100">Interview Simulation</p>
            <p className="text-xs text-gray-500">30 questions · 45 min timer</p>
          </div>
        </Link>
        <Link
          to="/interview-prep/behavioral"
          className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl transition-colors"
        >
          <span className="text-2xl">🗣</span>
          <div>
            <p className="text-sm font-medium text-gray-100">Behavioral Questions</p>
            <p className="text-xs text-gray-500">15 STAR-format questions</p>
          </div>
        </Link>
        <Link
          to="/interview-prep/system-design"
          className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl transition-colors"
        >
          <span className="text-2xl">🏗</span>
          <div>
            <p className="text-sm font-medium text-gray-100">System Design</p>
            <p className="text-xs text-gray-500">6 classic designs</p>
          </div>
        </Link>
      </div>

      {/* Topic checklist */}
      <div className="space-y-4">
        {Array.from(grouped.entries()).map(([group, groupTopics]) => {
          if (!groupTopics.length) return null
          const isCollapsed = collapsed.has(group)
          const groupReady = groupTopics.filter(t => (interviewPrepStatus[t.id] ?? 'not-started') === 'ready').length

          return (
            <div key={group} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(group)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>▶</span>
                  <span className="font-medium text-gray-200">{group}</span>
                </div>
                <span className="text-xs text-gray-500">{groupReady}/{groupTopics.length} ready</span>
              </button>

              {!isCollapsed && (
                <div className="border-t border-gray-800">
                  {groupTopics.map(topic => {
                    const status = interviewPrepStatus[topic.id] ?? 'not-started'
                    return (
                      <div key={topic.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-800 last:border-0">
                        <span className="text-sm text-gray-300 flex-1">{topic.title}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => cycleStatus(topic.id)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${STATUS_COLOR[status]}`}
                          >
                            {STATUS_LABEL[status]}
                          </button>
                          <Link
                            to={`/interview-prep/${topic.id}`}
                            className="text-xs text-indigo-400 hover:text-indigo-300 whitespace-nowrap"
                          >
                            Study Q&amp;A →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
