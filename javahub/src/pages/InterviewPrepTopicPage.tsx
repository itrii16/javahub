import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { allInterviewQuestions } from '@/content/interview'
import { topicMap } from '@/content'
import type { InterviewQuestion } from '@/types/content'

function AnswerBlock({ question }: { question: InterviewQuestion }) {
  const [open, setOpen] = useState(false)
  const [followOpen, setFollowOpen] = useState(false)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Question header */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-gray-100 font-medium leading-snug flex-1">{question.question}</p>
        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium ${
          question.difficulty === 'Beginner' ? 'text-green-400 bg-green-900/20' :
          question.difficulty === 'Mid' ? 'text-yellow-400 bg-yellow-900/20' :
          'text-red-400 bg-red-900/20'
        }`}>{question.difficulty}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {question.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Answer toggle */}
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {open ? '▲ Hide answer' : '▼ Show answer'}
        </button>

        {open && (
          <div className="mt-3 space-y-2">
            {!open && (
              <p className="text-sm text-gray-400 leading-relaxed">{question.answer.summary}</p>
            )}
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono bg-gray-950 rounded-lg p-4 border border-gray-800">
              {question.answer.full}
            </div>
          </div>
        )}

        {!open && (
          <p className="mt-2 text-sm text-gray-500 italic">{question.answer.summary}</p>
        )}
      </div>

      {/* Tricky follow-up */}
      {question.trickyFollowUp && (
        <div className="border-l-2 border-yellow-600/40 pl-4 space-y-2">
          <p className="text-xs text-yellow-500 font-medium uppercase tracking-wide">Tricky follow-up</p>
          <p className="text-sm text-gray-300">{question.trickyFollowUp.question}</p>
          <button
            onClick={() => setFollowOpen(v => !v)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {followOpen ? '▲ Hide answer' : '▼ Show answer'}
          </button>
          {followOpen && (
            <p className="text-sm text-gray-400 leading-relaxed mt-1">{question.trickyFollowUp.answer}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function InterviewPrepTopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? topicMap[topicId] : null

  const questions = allInterviewQuestions.filter(q => q.topicId === topicId)

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="mb-4">Topic not found.</p>
        <Link to="/interview-prep" className="text-indigo-400 hover:text-indigo-300">← Interview Prep</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/interview-prep" className="hover:text-gray-300 transition-colors">Interview Prep</Link>
        <span>›</span>
        <span className="text-gray-300">{topic.title}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-100">{topic.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{questions.length} interview question{questions.length !== 1 ? 's' : ''}</p>
      </div>

      {questions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
          No interview questions yet for this topic. Check back soon.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => <AnswerBlock key={q.id} question={q} />)}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          to={`/topic/${topicId}`}
          className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
        >
          Study cards →
        </Link>
        <Link
          to={`/topic/${topicId}/quiz`}
          className="px-4 py-2 text-sm border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-indigo-300 rounded-lg transition-colors"
        >
          Take quiz →
        </Link>
      </div>
    </div>
  )
}
