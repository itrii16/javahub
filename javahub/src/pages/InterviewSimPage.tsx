import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { buildSimQueue } from '@/lib/simSampler'
import questionsData from '@/content/assessment/questions.json'
import type { QuizQuestion } from '@/types/content'

const SIM_DURATION_MS = 45 * 60 * 1000  // 45 minutes
const WARN_MS = 5 * 60 * 1000           // turn red at 5 min remaining

type Phase = 'landing' | 'quiz'

export default function InterviewSimPage() {
  const navigate = useNavigate()
  const topicScores = useAppStore(s => s.userProfile.topicScores)
  const recordSimAttempt = useAppStore(s => s.recordSimAttempt)

  const [phase, setPhase] = useState<Phase>('landing')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [cursor, setCursor] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ questionId: string; selectedId: string | null }[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [remaining, setRemaining] = useState(SIM_DURATION_MS)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleStart = () => {
    const q = buildSimQueue(questionsData as QuizQuestion[], topicScores, 30)
    setQuestions(q)
    setCursor(0)
    setSelected(null)
    setAnswers([])
    const now = Date.now()
    setStartTime(now)
    setRemaining(SIM_DURATION_MS)
    setPhase('quiz')
  }

  // countdown
  useEffect(() => {
    if (phase !== 'quiz') return
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1000) {
          clearInterval(timerRef.current!)
          finishSim(true)
          return 0
        }
        return r - 1000
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  const finishSim = (timeExpired = false) => {
    clearInterval(timerRef.current!)
    const timeTakenMs = Date.now() - startTime

    // collect final answers (unanswered = null)
    setAnswers(prev => {
      const finalAnswers = [...prev]
      // Add current selected if not yet committed
      if (questions[cursor] && !finalAnswers.find(a => a.questionId === questions[cursor].id)) {
        finalAnswers.push({ questionId: questions[cursor].id, selectedId: selected })
      }
      // Fill remaining unanswered
      for (let i = finalAnswers.length; i < questions.length; i++) {
        finalAnswers.push({ questionId: questions[i].id, selectedId: null })
      }

      const enriched = finalAnswers.map(a => {
        const q = questions.find(q => q.id === a.questionId)!
        const correct = a.selectedId !== null && q.options.find(o => o.id === a.selectedId)?.isCorrect === true
        return { ...a, correct }
      })

      const score = enriched.filter(a => a.correct).length
      const topicBreakdown: Record<string, { correct: number; total: number }> = {}
      for (const a of enriched) {
        const q = questions.find(q => q.id === a.questionId)!
        if (!topicBreakdown[q.topicId]) topicBreakdown[q.topicId] = { correct: 0, total: 0 }
        topicBreakdown[q.topicId].total++
        if (a.correct) topicBreakdown[q.topicId].correct++
      }

      recordSimAttempt({ date: new Date().toISOString(), score, total: questions.length, timeTakenMs, topicScores: topicBreakdown })

      navigate('/interview-sim/results', {
        state: { answers: enriched, questions, timeTakenMs, topicBreakdown },
      })

      return finalAnswers
    })
  }

  const handleNext = () => {
    const current = questions[cursor]
    setAnswers(prev => [...prev, { questionId: current.id, selectedId: selected }])
    setSelected(null)

    if (cursor + 1 >= questions.length) {
      finishSim(false)
    } else {
      setCursor(cursor + 1)
    }
  }

  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-indigo-400 font-medium uppercase tracking-wide">F3 — Practice</p>
            <h1 className="text-3xl font-bold text-gray-100">Interview Simulation</h1>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left space-y-2 text-sm text-gray-400">
            <p>📋 <span className="text-gray-200">30 questions</span> across all Java topics</p>
            <p>⏱ <span className="text-gray-200">45-minute</span> countdown timer</p>
            <p>🔇 <span className="text-gray-200">No feedback</span> during the quiz — results at the end</p>
            <p>📄 <span className="text-gray-200">Downloadable PDF</span> report on completion</p>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Start Simulation
          </button>
        </div>
      </div>
    )
  }

  const mins = Math.floor(remaining / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)
  const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const isWarning = remaining <= WARN_MS
  const current = questions[cursor]

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Q {cursor + 1} / {questions.length}</span>
          <span className={`font-mono text-lg font-bold ${isWarning ? 'text-red-400' : 'text-gray-400'}`}>
            {timerStr}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((cursor + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
              current.difficulty === 'Beginner' ? 'text-green-400 bg-green-900/20' :
              current.difficulty === 'Mid' ? 'text-yellow-400 bg-yellow-900/20' :
              'text-red-400 bg-red-900/20'
            }`}>{current.difficulty}</span>
          </div>
          <p className="text-gray-100 text-lg leading-relaxed">{current.question}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {current.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-colors text-gray-100 ${
                selected === opt.id
                  ? 'bg-gray-800 border-indigo-500'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-600'
              }`}
            >
              <span className="font-mono text-xs text-gray-500 mr-3">{opt.id.toUpperCase()}</span>
              {opt.text}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
        >
          {cursor + 1 >= questions.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
