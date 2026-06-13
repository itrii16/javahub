import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { topics, allCards } from '@/content'
import { useAppStore } from '@/store/useAppStore'
import { getDueCardIds } from '@/lib/sm2'
import { SkillRadarChart } from '@/components/dashboard/SkillRadarChart'
import { computeGroupScores, TOPIC_GROUPS } from '@/lib/scoreCalculator'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{score}%</span>
    </div>
  )
}

export default function HomePage() {
  const streak = useAppStore(s => s.streak)
  const lastVisited = useAppStore(s => s.lastVisited)
  const cardProgressMap = useAppStore(s => s.cardProgress)
  const sessionCount = useAppStore(s => s.sessionCount)
  const syncNudgeDismissed = useAppStore(s => s.syncNudgeDismissed)
  const dismissSyncNudge = useAppStore(s => s.dismissSyncNudge)
  const userProfile = useAppStore(s => s.userProfile)
  const assessmentHistory = useAppStore(s => s.assessmentHistory)
  const quizHistory = useAppStore(s => s.quizHistory)

  const [showAllTopics, setShowAllTopics] = useState(false)

  const allCardIds = useMemo(() => allCards.map(c => c.id), [])
  const dueIds = useMemo(
    () => getDueCardIds(allCardIds, cardProgressMap),
    [allCardIds, cardProgressMap]
  )

  const lastVisitedEntries = useMemo(() => {
    return Object.entries(lastVisited)
      .map(([topicId, cardId]) => ({
        topicId,
        cardId,
        topic: topics.find(t => t.id === topicId),
        card: allCards.find(c => c.id === cardId),
      }))
      .filter(e => e.topic && e.card)
      .slice(0, 1)
  }, [lastVisited])

  const topicStats = useMemo(() => {
    return topics.map(topic => {
      const cards = topic.subtopics.flatMap(s => s.cards)
      const mastered = cards.filter(c => cardProgressMap[c.id]?.status === 'mastered').length
      const due = getDueCardIds(cards.map(c => c.id), cardProgressMap).length
      return { topic, total: cards.length, mastered, due }
    })
  }, [cardProgressMap])

  // Assessment data
  const hasAssessment = assessmentHistory.length > 0 || Object.keys(userProfile.topicScores).length > 0
  const lastAssessmentDate = assessmentHistory.length > 0
    ? new Date(assessmentHistory[assessmentHistory.length - 1].completedAt ?? '')
    : null
  const daysSinceAssessment = lastAssessmentDate
    ? Math.floor((Date.now() - lastAssessmentDate.getTime()) / 86_400_000)
    : null

  const groupScores = useMemo(
    () => computeGroupScores(userProfile.topicScores),
    [userProfile.topicScores]
  )

  // Study plan — weakest topics first
  const studyPlanTopics = useMemo(() => {
    return topics
      .filter(t => TOPIC_GROUPS[t.id])
      .map(t => ({ topic: t, score: userProfile.topicScores[t.id] ?? 50 }))
      .sort((a, b) => a.score - b.score)
  }, [userProfile.topicScores])

  const weakestTopic = studyPlanTopics[0]

  // Quiz history chart — last 10 attempts across all topics
  const quizChartData = useMemo(() => {
    const all = Object.entries(quizHistory)
      .flatMap(([topicId, attempts]) =>
        attempts.map(a => ({ ...a, topicId, topicTitle: topics.find(t => t.id === topicId)?.title ?? topicId }))
      )
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10)

    return all.map(a => ({
      label: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pct: Math.round((a.score / a.total) * 100),
      topic: a.topicTitle,
    }))
  }, [quizHistory])

  const dueByTopic = useMemo(() => {
    return topics
      .map(topic => {
        const ids = topic.subtopics.flatMap(s => s.cards).map(c => c.id)
        const count = ids.filter(id => dueIds.includes(id)).length
        return { topic, count }
      })
      .filter(x => x.count > 0)
  }, [dueIds])

  const showSyncNudge = !syncNudgeDismissed && sessionCount >= 3

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {dueIds.length > 0
              ? `${dueIds.length} card${dueIds.length === 1 ? '' : 's'} due for review`
              : 'All caught up — no cards due today'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-gray-800 text-gray-500 rounded-full">Saved locally</span>
          {streak.count > 0 && (
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-100">{streak.count}</p>
              <p className="text-xs text-gray-600">day streak</p>
            </div>
          )}
        </div>
      </div>

      {/* Sync nudge */}
      {showSyncNudge && (
        <div className="px-4 py-3 bg-yellow-900/20 border border-yellow-700/40 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-300">Sync your progress across devices</p>
            <p className="text-xs text-yellow-600 mt-0.5">Sign in with Google to back up and access on any device</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              disabled
              className="px-3 py-1.5 bg-yellow-600/20 border border-yellow-600/40 text-yellow-400 text-xs rounded-lg cursor-not-allowed"
              title="Coming soon"
            >
              Sign in
            </button>
            <button
              onClick={dismissSyncNudge}
              className="text-yellow-700 hover:text-yellow-500 text-xs"
            >✕</button>
          </div>
        </div>
      )}

      {/* Stale assessment banner */}
      {daysSinceAssessment !== null && daysSinceAssessment > 30 && (
        <div className="px-4 py-3 bg-yellow-900/10 border border-yellow-800/30 rounded-xl flex items-center justify-between">
          <p className="text-sm text-yellow-500">Your last assessment was {daysSinceAssessment} days ago — retake for updated scores?</p>
          <Link to="/assessment" className="text-xs text-indigo-400 hover:text-indigo-300 flex-shrink-0 ml-4">Retake →</Link>
        </div>
      )}

      {/* Skill Radar */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Skill Overview</h2>
        {hasAssessment ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SkillRadarChart groupScores={groupScores} />
          </div>
        ) : (
          <Link
            to="/assessment"
            className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl p-6 transition-colors group"
          >
            <span className="text-3xl">📊</span>
            <div>
              <p className="font-medium text-gray-100 group-hover:text-indigo-300 transition-colors">Take your skill assessment</p>
              <p className="text-sm text-gray-500 mt-1">Get a personalised study plan based on your Java knowledge</p>
            </div>
          </Link>
        )}
      </section>

      {/* Weakest area callout */}
      {hasAssessment && weakestTopic && weakestTopic.score < 80 && (
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Biggest Gap</h2>
          <div className="bg-gray-900 border border-red-900/30 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">
                <span className="text-gray-500">Weakest topic: </span>
                <span className="font-semibold text-red-400">{weakestTopic.topic.title}</span>
                <span className="text-gray-500"> — {weakestTopic.score}% score</span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Link
                to={`/topic/${weakestTopic.topic.id}/study`}
                className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                Study
              </Link>
              <Link
                to={`/topic/${weakestTopic.topic.id}/quiz`}
                className="text-xs px-3 py-1.5 border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-indigo-300 rounded-lg transition-colors"
              >
                Quiz
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Study plan */}
      {hasAssessment && (
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Study Plan</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
            {(showAllTopics ? studyPlanTopics : studyPlanTopics.slice(0, 5)).map(({ topic, score }) => (
              <div key={topic.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-sm text-gray-300 w-40 flex-shrink-0 truncate">{topic.title}</span>
                {score >= 80 ? (
                  <span className="text-green-400 text-xs flex-1">✓ Strong</span>
                ) : (
                  <ScoreBar score={score} />
                )}
                <Link
                  to={`/topic/${topic.id}/study`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex-shrink-0"
                >
                  Study →
                </Link>
              </div>
            ))}
            {!showAllTopics && studyPlanTopics.length > 5 && (
              <button
                onClick={() => setShowAllTopics(true)}
                className="w-full text-xs text-gray-500 hover:text-gray-300 py-3 transition-colors"
              >
                Show all {studyPlanTopics.length} topics →
              </button>
            )}
          </div>
        </section>
      )}

      {/* Quiz history */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Quiz History</h2>
        {quizChartData.length > 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={quizChartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#e5e7eb' }}
                  formatter={(v: number, _: string, entry: { payload?: { topic?: string } }) => [
                    `${v}%`,
                    entry.payload?.topic ?? '',
                  ]}
                />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                  {quizChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.pct >= 80 ? '#4ade80' : entry.pct >= 50 ? '#facc15' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-8 text-center">
            <p className="text-gray-500 text-sm">No quiz history yet</p>
            <Link to="/topic/java-core/quiz" className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
              Take a topic quiz →
            </Link>
          </div>
        )}
      </section>

      {/* Continue */}
      {lastVisitedEntries.length > 0 && (
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Continue</h2>
          {lastVisitedEntries.map(({ topicId, cardId, topic, card }) => (
            <Link
              key={topicId}
              to={`/topic/${topicId}/card/${cardId}`}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-600 mb-0.5">{topic!.title}</p>
                <p className="text-sm font-medium text-gray-200 truncate">{card!.title}</p>
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0">Continue →</span>
            </Link>
          ))}
        </section>
      )}

      {/* Due today */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Due Today</h2>
        {dueByTopic.length > 0 ? (
          <div className="flex flex-col gap-2">
            {dueByTopic.map(({ topic, count }) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}/study`}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-200">{topic.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{count} card{count === 1 ? '' : 's'} due</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors">
                  Study
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-6 text-center">
            <p className="text-gray-400 text-sm">All caught up! 🎉</p>
            <Link to="/topic/java-core" className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
              Review a topic anyway →
            </Link>
          </div>
        )}
      </section>

      {/* All topics */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicStats.map(({ topic, total, mastered, due }) => {
            const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
            return (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-600 mb-0.5 truncate">{topic.group}</p>
                    <p className="text-sm font-medium text-gray-200 group-hover:text-gray-100 transition-colors">{topic.title}</p>
                  </div>
                  {due > 0 && (
                    <span className="ml-2 text-[11px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded flex-shrink-0">
                      {due}
                    </span>
                  )}
                </div>
                <div className="h-px bg-gray-800 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-600">
                  <span>{mastered}/{total} mastered</span>
                  <span>~{topic.estimatedMinutes} min</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
