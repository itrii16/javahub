import { useLocation, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { QuizQuestion } from '@/types/content'
import { printSimReport } from '@/lib/pdfReport'

interface Answer {
  questionId: string
  selectedId: string | null
  correct: boolean
}

interface LocationState {
  answers: Answer[]
  questions: QuizQuestion[]
  timeTakenMs: number
  topicBreakdown: Record<string, { correct: number; total: number }>
}

export default function InterviewSimResultsPage() {
  const location = useLocation()
  const state = location.state as LocationState | null

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No simulation results found.</p>
          <Link to="/interview-sim" className="text-indigo-400 hover:text-indigo-300">← Start a simulation</Link>
        </div>
      </div>
    )
  }

  const { answers, questions, timeTakenMs, topicBreakdown } = state
  const score = answers.filter(a => a.correct).length
  const total = questions.length
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 70
  const mins = Math.floor(timeTakenMs / 60000)
  const secs = Math.floor((timeTakenMs % 60000) / 1000)

  const wrongAnswers = answers.filter(a => !a.correct).map(a => {
    const q = questions.find(q => q.id === a.questionId)!
    const selected = q.options.find(o => o.id === a.selectedId)
    const correct = q.options.find(o => o.isCorrect)!
    return { q, selected, correct }
  })

  const chartData = Object.entries(topicBreakdown)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .map(([tid, { correct, total }]) => ({
      topic: tid.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: Math.round((correct / total) * 100),
    }))

  const bottomTopics = Object.entries(topicBreakdown)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .slice(0, 3)

  const handlePrint = () => {
    printSimReport({ score, total, timeTakenMs, answers, questions, topicBreakdown })
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Score */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Interview Simulation</p>
          <p className="text-6xl font-bold text-indigo-400">{score} / {total}</p>
          <p className="text-2xl font-semibold text-gray-300">{pct}%</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${
              passed ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
            }`}>{passed ? 'Passed ✓' : 'Keep practicing'}</span>
            <span className="text-sm text-gray-500">⏱ {mins}m {secs}s</span>
          </div>
        </div>

        {/* Topic breakdown bar chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-100">Score by Topic</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis type="category" dataKey="topic" tick={{ fill: '#d1d5db', fontSize: 11 }} width={100} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                formatter={(v: number) => [`${v}%`, 'Score']}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.score >= 70 ? '#4ade80' : d.score >= 40 ? '#facc15' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommended study areas */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-100">Recommended Study Areas</h2>
          {bottomTopics.map(([tid, { correct, total }]) => (
            <div key={tid} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <span className="text-gray-300 capitalize">{tid.replace(/-/g, ' ')}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{correct}/{total}</span>
                <Link
                  to={`/topic/${tid}`}
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Study now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Full question review */}
        {wrongAnswers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Wrong Answers Review ({wrongAnswers.length})</h2>
            {wrongAnswers.map(({ q, selected, correct }) => (
              <div key={q.id} className="bg-red-900/10 border border-red-900/30 rounded-xl p-5 space-y-2">
                <p className="text-gray-100 font-medium">{q.question}</p>
                {selected
                  ? <p className="text-sm text-red-400">✗ Your answer: {selected.text}</p>
                  : <p className="text-sm text-gray-500 italic">Not answered</p>
                }
                <p className="text-sm text-green-400">✓ Correct: {correct.text}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{q.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 flex-wrap">
          <Link
            to="/interview-sim"
            className="flex-1 py-3 text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            Retry simulation
          </Link>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="py-3 px-5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 rounded-xl text-sm transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  )
}
