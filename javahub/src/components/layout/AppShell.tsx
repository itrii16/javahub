import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Breadcrumb from './Breadcrumb'

export default function AppShell() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 overflow-y-auto">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <div className="px-6 pt-3 pb-1 border-b border-gray-800">
          <Breadcrumb />
        </div>
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
