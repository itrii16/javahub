import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { SkillRadarChart } from '@/components/dashboard/SkillRadarChart'
import { computeGroupScores, TOPIC_GROUPS } from '@/lib/scoreCalculator'
import { topics } from '@/content'

const TOPIC_MINUTES: Record<string, number> = Object.fromEntries(
  topics.map(t => [t.id, t.estimatedMinutes])
)

function readinessLabel(avg: number) {
  if (avg < 40) return { text: 'Not ready', color: 'text-red-400' }
  if (avg < 55) return { text: 'Getting there', color: 'text-yellow-400' }
  if (avg < 70) return { text: 'Almost there', color: 'text-yellow-300' }
  return { text: 'Interview ready', color: 'text-green-400' }
}

function scoreBadge(score: number) {
  if (score < 40) return 'bg-red-900/40 text-red-300'
  if (score < 70) return 'bg-yellow-900/40 text-yellow-300'
  return 'bg-green-900/40 text-green-300'
}

export default function AssessmentResultsPage() {
  const userProfile = useAppStore(s => s.userProfile)
  const assessmentHistory = useAppStore(s => s.assessmentHistory)
  const [showStrong, setShowStrong] = useState(false)

  const lastSession = assessmentHistory[assessmentHistory.length - 1]
  const topicScores = userProfile.topicScores

  const groupScores = computeGroupScores(topicScores)

  const allGroupValues = Object.values(groupScores)
  const avgScore = allGroupValues.length
    ? Math.round(allGroupValues.reduce((a, b) => a + b, 0) / allGroupValues.length)
    : 50

  const sortedGroups = Object.entries(groupScores).sort((a, b) => b[1] - a[1])
  const strongest = sortedGroups[0]?.[0] ?? '—'
  const weakest = sortedGroups[sortedGroups.length - 1]?.[0] ?? '—'

  const readiness = readinessLabel(avgScore)

  // All 21 topics sorted weakest → strongest
  const allTopicIds = Object.keys(TOPIC_GROUPS)
  const sortedTopics = allTopicIds
    .map(id => ({ id, score: topicScores[id] ?? 50, minutes: TOPIC_MINUTES[id] ?? 30 }))
    .sort((a, b) => a.score - b.score)

  const weakTopics = sortedTopics.filter(t => t.score < 80)
  const strongTopics = sortedTopics.filter(t => t.score >= 80)
  const weakestTopicId = weakTopics[0]?.id ?? sortedTopics[0]?.id

  if (!lastSession && Object.keys(topicScores).length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No assessment data yet.</p>
          <Link to="/assessment" className="text-indigo-400 hover:text-indigo-300 underline">
            Take the assessment
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-100">Your Skill Profile</h1>
          {lastSession?.completedAt && (
            <p className="text-sm text-gray-500">
              Assessed {new Date(lastSession.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Radar chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SkillRadarChart groupScores={groupScores} />
        </div>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-100">Summary</h2>
          <p className="text-gray-300">
            Your strongest area is <span className="font-semibold text-green-400">{strongest}</span>.
          </p>
          <p className="text-gray-300">
            Your biggest gap is <span className="font-semibold text-red-400">{weakest}</span>.
          </p>
          <p className="text-gray-300">
            Interview readiness:{' '}
            <span className={`font-semibold ${readiness.color}`}>{readiness.text}</span>
            {' '}({avgScore}% avg)
          </p>
        </div>

        {/* Study plan */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-100">Personalized Study Plan</h2>
          <div className="space-y-2">
            {weakTopics.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${scoreBadge(t.score)}`}>
                    {t.score}%
                  </span>
                  <span className="text-gray-200 capitalize">{t.id.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{t.minutes} min</span>
                  <Link
                    to={`/topic/${t.id}`}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Study now →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {strongTopics.length > 0 && (
            <div>
              <button
                onClick={() => setShowStrong(v => !v)}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showStrong ? '▲' : '▼'} Already strong ({strongTopics.length} topics)
              </button>
              {showStrong && (
                <div className="mt-2 space-y-2">
                  {strongTopics.map(t => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 opacity-60">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${scoreBadge(t.score)}`}>
                          {t.score}%
                        </span>
                        <span className="text-gray-300 capitalize">{t.id.replace(/-/g, ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {weakestTopicId && (
            <Link
              to={`/topic/${weakestTopicId}`}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-center transition-colors"
            >
              Start studying
            </Link>
          )}
          <Link
            to="/"
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium text-center transition-colors"
          >
            Go to dashboard
          </Link>
          <Link
            to="/assessment"
            className="py-3 px-5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 rounded-xl text-sm transition-colors"
          >
            Retake
          </Link>
        </div>
      </div>
    </div>
  )
}
