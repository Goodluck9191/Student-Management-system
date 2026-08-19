import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar, type NavItem } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'

interface RoleLayoutProps {
  navItems: NavItem[]
  footerItems?: NavItem[]
  notificationsTo: string
}

export function RoleLayout({ navItems, footerItems, notificationsTo }: RoleLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        navItems={navItems}
        footerItems={footerItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          notificationsTo={notificationsTo}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}