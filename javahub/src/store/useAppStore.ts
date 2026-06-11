import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppProgress, CardProgress, CardStatus } from '@/types'
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
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialProgress,

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
    }),
    {
      name: 'javahub-progress',
      version: 1,
    }
  )
)
