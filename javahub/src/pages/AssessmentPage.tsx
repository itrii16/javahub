import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { buildAssessmentQueue } from '@/lib/assessmentSampler'
import { QuizQuestionCard } from '@/components/assessment/QuizQuestionCard'
import { AssessmentComplete } from '@/components/assessment/AssessmentComplete'
import type { QuizQuestion } from '@/types/content'
import questionsData from '@/content/assessment/questions.json'

type Phase = 'landing' | 'quiz' | 'complete'

const ALL_TOPIC_IDS = [
  'java-core', 'collections', 'concurrency', 'jvm-internals', 'generics',
  'oop', 'solid', 'clean-code', 'design-patterns', 'refactoring', 'testing',
  'api-design', 'architecture-patterns', 'database-fundamentals',
  'distributed-systems', 'security-basics', 'logging-observability',
  'data-structures', 'algorithms', 'system-design', 'javadoc',
]

export default function AssessmentPage() {
  const navigate = useNavigate()
  const startAssessment = useAppStore(s => s.startAssessment)
  const recordAnswer = useAppStore(s => s.recordAnswer)
  const currentAssessment = useAppStore(s => s.currentAssessment)

  const [phase, setPhase] = useState<Phase>('landing')
  const [queue, setQueue] = useState<QuizQuestion[]>([])
  const [cursor, setCursor] = useState(0)
  const [skipModal, setSkipModal] = useState(false)

  const handleStart = () => {
    startAssessment()
    const q = buildAssessmentQueue(questionsData as QuizQuestion[], 25)
    setQueue(q)
    setCursor(0)
    setPhase('quiz')
  }

  const handleNext = (correct: boolean, followUpId?: string) => {
    const q = currentAssessment
    if (q && queue[cursor]) {
      const opt = queue[cursor].options.find(o => {
        if (correct) return o.isCorrect
        return false
      })
      const selectedOpt = queue[cursor].options.find(o => !correct && !o.isCorrect) ?? queue[cursor].options[0]
      recordAnswer(queue[cursor].id, selectedOpt.id, correct)
    }

    let nextQueue = queue
    if (followUpId) {
      const followUp = (questionsData as QuizQuestion[]).find(q => q.id === followUpId)
      if (followUp) {
        const before = queue.slice(0, cursor + 1)
        const after = queue.slice(cursor + 1)
        nextQueue = [...before, followUp, ...after]
        setQueue(nextQueue)
      }
    }

    const nextCursor = cursor + 1
    if (nextCursor >= nextQueue.length) {
      setPhase('complete')
    } else {
      setCursor(nextCursor)
    }
  }

  if (phase === 'complete') {
    const answers = currentAssessment?.answers ?? []
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AssessmentComplete answers={answers} topicIds={ALL_TOPIC_IDS} />
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <QuizQuestionCard
            question={queue[cursor]}
            current={cursor + 1}
            total={queue.length}
            onNext={handleNext}
          />
        </div>
      </div>
    )
  }

  // Landing
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-100">Initial Assessment</h1>
          <p className="text-gray-400 leading-relaxed">
            25 questions across all Java topics. We'll adapt based on your answers
            and build a personalised study plan.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Start Assessment
          </button>
          <button
            onClick={() => setSkipModal(true)}
            className="w-full py-3 text-gray-400 hover:text-gray-200 text-sm transition-colors"
          >
            Skip — I know my level
          </button>
        </div>
      </div>

      {skipModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setSkipModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full space-y-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-100">Select your level</h2>
            <div className="flex flex-col gap-3">
              {(['Junior', 'Mid', 'Senior'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => navigate('/')}
                  className="py-3 rounded-xl border border-gray-700 hover:border-indigo-500 text-gray-200 hover:text-white transition-colors"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
