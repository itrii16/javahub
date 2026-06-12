import { createBrowserRouter } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import { topicMap } from '@/content'
import HomePage from '@/pages/HomePage'
import TopicPage from '@/pages/TopicPage'
import CardDetailPage from '@/pages/CardDetailPage'
import StudyPage from '@/pages/StudyPage'
import SessionSummaryPage from '@/pages/SessionSummaryPage'
import AssessmentPage from '@/pages/AssessmentPage'
import AssessmentResultsPage from '@/pages/AssessmentResultsPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'topic/:topicId',
          element: <TopicPage />,
          handle: {
            crumb: (data: unknown, params?: Record<string, string>) => {
              const topic = params?.topicId ? topicMap[params.topicId] : null
              return topic?.title ?? 'Topic'
            },
          },
        },
        {
          path: 'topic/:topicId/card/:cardId',
          element: <CardDetailPage />,
          handle: {
            crumb: () => 'Card',
          },
        },
        {
          path: 'topic/:topicId/study',
          element: <StudyPage />,
          handle: {
            crumb: () => 'Study',
          },
        },
        {
          path: 'topic/:topicId/study/summary',
          element: <SessionSummaryPage />,
          handle: { crumb: () => 'Session Summary' },
        },
        {
          path: 'assessment',
          element: <AssessmentPage />,
        },
        {
          path: 'assessment/results',
          element: <AssessmentResultsPage />,
        },
      ],
    },
  ],
  { basename: '/javahub' }
)
