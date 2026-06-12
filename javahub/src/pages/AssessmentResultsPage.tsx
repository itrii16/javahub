import { Link } from 'react-router-dom'

export default function AssessmentResultsPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-100">Assessment complete</h1>
        <p className="text-gray-400">Skill profile loading… (full chart in T22)</p>
        <Link to="/" className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
