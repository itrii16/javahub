import { Link } from 'react-router-dom'
import { systemDesigns } from '@/content/systemdesign'

const ICONS: Record<string, string> = {
  'url-shortener': '🔗',
  'rate-limiter': '🛡',
  'notification-system': '🔔',
  'chat-application': '💬',
  'ecommerce-inventory': '📦',
  'cache-service': '⚡',
}

export default function SystemDesignListPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/interview-prep" className="hover:text-gray-300 transition-colors">Interview Prep</Link>
        <span>›</span>
        <span className="text-gray-300">System Design</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-100">System Design</h1>
        <p className="text-gray-500 text-sm mt-1">6 classic system designs with interactive architecture diagrams and Java implementation notes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {systemDesigns.map(design => (
          <Link
            key={design.id}
            to={`/interview-prep/system-design/${design.id}`}
            className="flex gap-4 p-5 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl transition-colors group"
          >
            <span className="text-3xl flex-shrink-0">{ICONS[design.id] ?? '🏗'}</span>
            <div className="min-w-0">
              <p className="font-medium text-gray-100 group-hover:text-indigo-300 transition-colors">{design.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{design.description}</p>
              <p className="text-xs text-gray-600 mt-2">{design.components.length} components · {design.requirements.length} requirements</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
