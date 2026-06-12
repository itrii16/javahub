import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppProgress, CardProgress, CardStatus } from '@/types'
import type { AssessmentSession, AssessmentAnswer, UserProfile } from '@/types/content'
import { SM2_DEFAULT_STATE } from '@/lib/sm2'

const initialProgress: AppProgress = {
  cardProgress: {},
  bookmarks: [],
  notes: {},
  lastVisited: {},
  streak: {
    lastActive: '',
    count: 0,
  },
  sessionCount: 0,
  guidedPathTopics: [],
}

interface AppStore extends AppProgress {
  getCardProgress: (cardId: string) => CardProgress
  setCardProgress: (cardId: string, progress: CardProgress) => void
  toggleBookmark: (cardId: string) => void
  isBookmarked: (cardId: string) => boolean
  setNote: (cardId: string, markdown: string) => void
  getNote: (cardId: string) => string
  setLastVisited: (topicId: string, cardId: string) => void
  touchStreak: () => void
  incrementSessionCount: () => void
  resetProgress: () => void
  isGuidedPath: (topicId: string) => boolean
  toggleGuidedPath: (topicId: string) => void
  // Assessment
  assessmentHistory: AssessmentSession[]
  currentAssessment: AssessmentSession | null
  startAssessment: () => void
  recordAnswer: (questionId: string, selectedOptionId: string, correct: boolean) => void
  completeAssessment: (topicScores: Record<string, number>) => void
  // User profile
  userProfile: UserProfile
  setUserProfile: (profile: Partial<UserProfile>) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialProgress,
      assessmentHistory: [],
      currentAssessment: null,
      userProfile: {
        level: null,
        assessmentDate: null,
        topicScores: {},
        groupScores: {},
      },

      setUserProfile: (profile) => {
        set(state => ({ userProfile: { ...state.userProfile, ...profile } }))
      },


      startAssessment: () => {
        const session: AssessmentSession = {
          id: crypto.randomUUID(),
          startedAt: new Date().toISOString(),
          answers: [],
          topicScores: {},
        }
        set({ currentAssessment: session })
      },

      recordAnswer: (questionId, selectedOptionId, correct) => {
        set(state => {
          if (!state.currentAssessment) return {}
          const answer: AssessmentAnswer = { questionId, selectedOptionId, correct }
          return {
            currentAssessment: {
              ...state.currentAssessment,
              answers: [...state.currentAssessment.answers, answer],
            },
          }
        })
      },

      completeAssessment: (topicScores) => {
        set(state => {
          if (!state.currentAssessment) return {}
          const completed: AssessmentSession = {
            ...state.currentAssessment,
            completedAt: new Date().toISOString(),
            topicScores,
          }
          return {
            currentAssessment: null,
            assessmentHistory: [...state.assessmentHistory, completed],
          }
        })
      },


      getCardProgress: (cardId) => {
        return get().cardProgress[cardId] ?? {
          status: 'unseen' as CardStatus,
          sm2: SM2_DEFAULT_STATE,
        }
      },

      setCardProgress: (cardId, progress) => {
        set(state => ({
          cardProgress: {
            ...state.cardProgress,
            [cardId]: progress,
          },
        }))
      },

      toggleBookmark: (cardId) => {
        set(state => {
          const isBookmarked = state.bookmarks.includes(cardId)
          return {
            bookmarks: isBookmarked
              ? state.bookmarks.filter(id => id !== cardId)
              : [...state.bookmarks, cardId],
          }
        })
      },

      isBookmarked: (cardId) => get().bookmarks.includes(cardId),

      setNote: (cardId, markdown) => {
        set(state => ({
          notes: { ...state.notes, [cardId]: markdown },
        }))
      },

      getNote: (cardId) => get().notes[cardId] ?? '',

      setLastVisited: (topicId, cardId) => {
        set(state => ({
          lastVisited: { ...state.lastVisited, [topicId]: cardId },
        }))
      },

      touchStreak: () => {
        const today = new Date().toISOString().split('T')[0]
        set(state => {
          const { lastActive, count } = state.streak
          if (lastActive === today) return {}
          const yesterday = new Date(Date.now() - 86_400_000)
            .toISOString()
            .split('T')[0]
          const newCount = lastActive === yesterday ? count + 1 : 1
          return { streak: { lastActive: today, count: newCount } }
        })
      },

      incrementSessionCount: () => {
        set(state => ({ sessionCount: state.sessionCount + 1 }))
      },

      resetProgress: () => set(initialProgress),

      isGuidedPath: (topicId) => get().guidedPathTopics.includes(topicId),

      toggleGuidedPath: (topicId) => {
        set(state => ({
          guidedPathTopics: state.guidedPathTopics.includes(topicId)
            ? state.guidedPathTopics.filter(id => id !== topicId)
            : [...state.guidedPathTopics, topicId],
        }))
      },
    }),
    {
      name: 'javahub-progress',
      version: 1,
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { currentAssessment, ...rest } = state
        return rest
      },
    }
  )
)
