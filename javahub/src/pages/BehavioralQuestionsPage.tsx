import { useState } from 'react'
import { Link } from 'react-router-dom'
import behavioralData from '@/content/interview/behavioral.json'

interface BehavioralQuestion {
  id: string
  question: string
  modelAnswer: string
}

const questions = behavioralData as BehavioralQuestion[]

function QuestionRow({ q, index }: { q: BehavioralQuestion; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-gray-800/40 transition-colors"
      >
        <span className="flex-shrink-0 text-sm font-mono text-indigo-400 mt-0.5">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-gray-100 text-sm leading-snug flex-1">{q.question}</span>
        <span className="flex-shrink-0 text-gray-500 text-xs mt-0.5">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-800">
          <div className="mt-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {q.modelAnswer}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BehavioralQuestionsPage() {
  const [starOpen, setStarOpen] = useState(true)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/interview-prep" className="hover:text-gray-300 transition-colors">Interview Prep</Link>
        <span>›</span>
        <span className="text-gray-300">Behavioral Questions</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-100">Behavioral Questions</h1>
        <p className="text-gray-500 text-sm mt-1">15 Java-engineer-specific questions with STAR-format model answers</p>
      </div>

      {/* STAR guide */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setStarOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-indigo-300">STAR Method Guide</span>
          </div>
          <span className="text-gray-500 text-xs">{starOpen ? '▲ Collapse' : '▼ Expand'}</span>
        </button>
        {starOpen && (
          <div className="px-5 pb-5 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { letter: 'S', name: 'Situation', desc: 'Set the context — where, when, what team' },
                { letter: 'T', name: 'Task', desc: 'Your specific responsibility or challenge' },
                { letter: 'A', name: 'Action', desc: 'What YOU did (most important — use "I" not "we")' },
                { letter: 'R', name: 'Result', desc: 'Quantified outcome — numbers, time saved, impact' },
              ].map(({ letter, name, desc }) => (
                <div key={letter} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm">
                    {letter}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Aim for 90-second answers. Practice out loud — not just in your head. Have 5–6 stories ready that can flex to different question types.
            </p>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, i) => <QuestionRow key={q.id} q={q} index={i} />)}
      </div>
    </div>
  )
}
