import { Link, useMatches } from 'react-router-dom'

interface BreadcrumbHandle {
  crumb: (data: unknown, params?: Record<string, string>) => React.ReactNode
}

export default function Breadcrumb() {
  const matches = useMatches()

  const crumbs = matches
    .filter(m => (m.handle as BreadcrumbHandle)?.crumb)
    .map(m => ({
      id: m.id,
      crumb: (m.handle as BreadcrumbHandle).crumb(m.data, m.params as Record<string, string>),
      pathname: m.pathname,
    }))

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs text-gray-500">
        <li>
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.id} className="flex items-center gap-2">
            <span className="text-gray-700">›</span>
            {i === crumbs.length - 1 ? (
              <span className="text-gray-400">{crumb.crumb}</span>
            ) : (
              <Link to={crumb.pathname} className="hover:text-gray-300 transition-colors">
                {crumb.crumb}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
