import { useLocation, useParams, Link } from 'react-router-dom'
import { topicMap } from '@/content'
import type { QuizQuestion } from '@/types/content'

interface LocationState {
  answers: { questionId: string; correct: boolean; selectedId: string }[]
  questions: QuizQuestion[]
  topicId: string
}

export default function QuizResultsPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null

  const topic = topicId ? topicMap[topicId] : null

  if (!state || !topic) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No quiz results found.</p>
          <Link to={`/topic/${topicId}`} className="text-indigo-400 hover:text-indigo-300">← Back to topic</Link>
        </div>
      </div>
    )
  }

  const { answers, questions } = state
  const score = answers.filter(a => a.correct).length
  const total = questions.length
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 70

  const wrongAnswers = answers
    .filter(a => !a.correct)
    .map(a => {
      const q = questions.find(q => q.id === a.questionId)!
      const selected = q.options.find(o => o.id === a.selectedId)
      const correct = q.options.find(o => o.isCorrect)!
      return { q, selected, correct }
    })

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Score */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide">{topic.title} · Practice Quiz</p>
          <p className="text-6xl font-bold text-indigo-400">{score} / {total}</p>
          <p className="text-2xl font-semibold text-gray-300">{pct}%</p>
          <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
            passed ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
          }`}>
            {passed ? 'Passed ✓' : 'Keep practicing'}
          </span>
        </div>

        {/* Wrong answers */}
        {wrongAnswers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Review wrong answers ({wrongAnswers.length})</h2>
            {wrongAnswers.map(({ q, selected, correct }) => {
              // Find a related content card link
              const subtopicCards = topic.subtopics
                .flatMap(s => s.cards)
                .find(c => c.subtopicId === q.subtopicId)

              return (
                <div key={q.id} className="bg-red-900/10 border border-red-900/30 rounded-xl p-5 space-y-3">
                  <p className="text-gray-100 font-medium">{q.question}</p>
                  {selected && (
                    <p className="text-sm text-red-400">✗ Your answer: {selected.text}</p>
                  )}
                  <p className="text-sm text-green-400">✓ Correct: {correct.text}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{q.explanation}</p>
                  {subtopicCards && (
                    <Link
                      to={`/topic/${topicId}/card/${subtopicCards.id}`}
                      className="inline-block text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Study this card →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {wrongAnswers.length === 0 && (
          <div className="text-center py-6 text-green-400 font-medium">
            🎉 Perfect score — no wrong answers!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to={`/topic/${topicId}/quiz`}
            className="flex-1 py-3 text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            Retake quiz
          </Link>
          <Link
            to={`/topic/${topicId}/study`}
            className="flex-1 py-3 text-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-colors"
          >
            Study this topic
          </Link>
          <Link
            to={`/topic/${topicId}`}
            className="py-3 px-5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 rounded-xl text-sm transition-colors"
          >
            Back to topic
          </Link>
        </div>
      </div>
    </div>
  )
}
