import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Breadcrumb from './Breadcrumb'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar when route changes on mobile
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-[100dvh] bg-gray-950 text-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — slide-in drawer on mobile, static on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto
          transform transition-transform duration-200 ease-in-out
          md:static md:w-64 md:translate-x-0 md:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onNavigate={closeSidebar} />
      </aside>

      {/* Main panel */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        <div className="px-4 md:px-6 pt-3 pb-1 border-b border-gray-800">
          <Breadcrumb />
        </div>
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
          <Outlet context={{ location }} />
        </main>
      </div>
    </div>
  )
}
