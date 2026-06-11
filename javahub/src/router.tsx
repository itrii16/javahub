import { createBrowserRouter } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import TopicPage from '@/pages/TopicPage'
import CardDetailPage from '@/pages/CardDetailPage'
import StudyPage from '@/pages/StudyPage'

export const router = createBrowserRouter([
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
          crumb: () => 'Topic',
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
    ],
  },
])
