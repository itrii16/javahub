import { useState, useEffect, useRef } from 'react'
import type { QuizQuestion } from '@/types/content'

interface Props {
  question: QuizQuestion
  current: number
  total: number
  onNext: (correct: boolean, followUpId?: string) => void
}

export function QuizQuestionCard({ question, current, total, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setSelected(null)
    setRevealed(false)
  }, [question.id])

  useEffect(() => {
    if (revealed && codeRef.current && (window as any).Prism) {
      ;(window as any).Prism.highlightElement(codeRef.current)
    }
  }, [revealed])

  const handleSelect = (id: string) => {
    if (revealed) return
    if (selected === id) {
      // second click submits
      setRevealed(true)
    } else {
      setSelected(id)
    }
  }

  const handleSubmit = () => {
    if (!selected || revealed) return
    setRevealed(true)
  }

  const handleNext = () => {
    const correctOpt = question.options.find(o => o.isCorrect)
    const correct = correctOpt?.id === selected
    onNext(correct, !correct ? question.followUpQuestionId : undefined)
  }

  const correctId = question.options.find(o => o.isCorrect)?.id
  const progress = Math.round((current / total) * 100)

  const hasCode = question.question.includes('```') || question.question.includes('`')

  const renderQuestion = () => {
    if (!hasCode) return <p className="text-gray-100 text-lg leading-relaxed">{question.question}</p>
    const parts = question.question.split(/```java\n?([\s\S]*?)```/)
    return (
      <div className="space-y-3">
        {parts.map((part, i) =>
          i % 2 === 0
            ? part && <p key={i} className="text-gray-100 text-lg leading-relaxed">{part.trim()}</p>
            : <pre key={i} className="bg-gray-950 rounded-lg p-4 overflow-x-auto text-sm">
                <code ref={codeRef} className="language-java">{part}</code>
              </pre>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{current} / {total}</span>
          <span className={
            question.difficulty === 'Beginner' ? 'text-green-400' :
            question.difficulty === 'Mid' ? 'text-yellow-400' : 'text-red-400'
          }>{question.difficulty}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        {renderQuestion()}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map(opt => {
          let cls = 'w-full text-left px-5 py-4 rounded-xl border transition-colors text-gray-100 '
          if (!revealed) {
            cls += selected === opt.id
              ? 'bg-gray-800 border-indigo-500'
              : 'bg-gray-900 border-gray-800 hover:border-gray-600'
          } else {
            if (opt.id === correctId) {
              cls += 'bg-green-900/30 border-green-600 text-green-300'
            } else if (opt.id === selected && opt.id !== correctId) {
              cls += 'bg-red-900/30 border-red-600 text-red-300'
            } else {
              cls += 'bg-gray-900 border-gray-800 opacity-50'
            }
          }
          return (
            <button key={opt.id} className={cls} onClick={() => handleSelect(opt.id)}>
              <span className="font-mono text-xs text-gray-500 mr-3">{opt.id.toUpperCase()}</span>
              {opt.text}
              {revealed && opt.id === correctId && <span className="ml-2 text-green-400">✓</span>}
              {revealed && opt.id === selected && opt.id !== correctId && <span className="ml-2 text-red-400">✗</span>}
            </button>
          )
        })}
      </div>

      {/* Submit / Explanation / Next */}
      {!revealed && selected && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
        >
          Submit Answer
        </button>
      )}

      {revealed && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
            <span className="font-semibold text-gray-100">Explanation: </span>
            {question.explanation}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
