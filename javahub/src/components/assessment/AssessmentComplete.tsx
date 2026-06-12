import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import type { AssessmentAnswer } from '@/types/content'

interface Props {
  answers: AssessmentAnswer[]
  topicIds: string[]
}

function computeTopicScores(answers: AssessmentAnswer[], topicIds: string[], questions: { id: string; topicId: string }[]): Record<string, number> {
  const qById = new Map(questions.map(q => [q.id, q]))
  const topicCorrect: Record<string, number> = {}
  const topicTotal: Record<string, number> = {}

  for (const a of answers) {
    const q = qById.get(a.questionId)
    if (!q) continue
    topicTotal[q.topicId] = (topicTotal[q.topicId] ?? 0) + 1
    if (a.correct) topicCorrect[q.topicId] = (topicCorrect[q.topicId] ?? 0) + 1
  }

  const scores: Record<string, number> = {}
  for (const tid of topicIds) {
    const total = topicTotal[tid] ?? 0
    const correct = topicCorrect[tid] ?? 0
    scores[tid] = total === 0 ? 0 : Math.round((correct / total) * 100)
  }
  return scores
}

export function AssessmentComplete({ answers, topicIds }: Props) {
  const navigate = useNavigate()
  const completeAssessment = useAppStore(s => s.completeAssessment)
  const setUserProfile = useAppStore(s => s.setUserProfile)

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { default: questionsData } = await import('@/content/assessment/questions.json')
      const { computeGroupScores } = await import('@/lib/scoreCalculator')
      const scores = computeTopicScores(answers, topicIds, questionsData as { id: string; topicId: string }[])
      const groupScores = computeGroupScores(scores)
      completeAssessment(scores)
      setUserProfile({ topicScores: scores, groupScores, assessmentDate: new Date().toISOString() })
      navigate('/assessment/results')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-300 text-lg">Calculating your skill profile…</p>
    </div>
  )
}
