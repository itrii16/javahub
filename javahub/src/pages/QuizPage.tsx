import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { QuizQuestionCard } from '@/components/assessment/QuizQuestionCard'
import { topicMap } from '@/content'
import questionsData from '@/content/assessment/questions.json'
import type { QuizQuestion } from '@/types/content'

const MIN_QUESTIONS = 3

export default function QuizPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const recordQuizAttempt = useAppStore(s => s.recordQuizAttempt)

  const topic = topicId ? topicMap[topicId] : null

  const questions = useMemo(() => {
    const all = (questionsData as QuizQuestion[]).filter(q => q.topicId === topicId)
    // Shuffle
    const arr = [...all]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, 15)
  }, [topicId])

  const [cursor, setCursor] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; selectedId: string }[]>([])
  const [started, setStarted] = useState(false)

  if (!topic || !topicId) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Topic not found.</p>
      </div>
    )
  }

  if (questions.length < MIN_QUESTIONS) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-2xl text-gray-100 font-semibold">Not enough questions yet</p>
          <p className="text-gray-400">Check back soon — more questions for this topic are coming.</p>
          <Link to={`/topic/${topicId}`} className="inline-block mt-2 text-indigo-400 hover:text-indigo-300">
            ← Back to topic
          </Link>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-indigo-400 font-medium uppercase tracking-wide">Practice Quiz</p>
            <h1 className="text-3xl font-bold text-gray-100">{topic.title}</h1>
            <p className="text-gray-400">{questions.length} questions · immediate feedback</p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Start Quiz
          </button>
          <Link to={`/topic/${topicId}`} className="block text-sm text-gray-500 hover:text-gray-300">
            ← Back to topic
          </Link>
        </div>
      </div>
    )
  }

  const handleNext = (correct: boolean) => {
    const current = questions[cursor]
    const selectedOpt = correct
      ? current.options.find(o => o.isCorrect)!
      : (current.options.find(o => !o.isCorrect) ?? current.options[0])

    const newAnswers = [...answers, { questionId: current.id, correct, selectedId: selectedOpt.id }]
    setAnswers(newAnswers)

    if (cursor + 1 >= questions.length) {
      const score = newAnswers.filter(a => a.correct).length
      recordQuizAttempt({ date: new Date().toISOString(), score, total: questions.length, topicId })
      navigate(`/topic/${topicId}/quiz/results`, {
        state: { answers: newAnswers, questions, topicId },
      })
    } else {
      setCursor(cursor + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{topic.title}</span>
          <Link to={`/topic/${topicId}`} className="text-sm text-gray-600 hover:text-gray-400">✕ Exit</Link>
        </div>
        <QuizQuestionCard
          question={questions[cursor]}
          current={cursor + 1}
          total={questions.length}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}
