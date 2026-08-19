import { Link } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { useNotifications } from '../../context/NotificationsContext'
import type { AuthUser } from '../../types/user'
import { capitalize } from '../../lib/format'

interface HeaderProps {
  onMenuClick: () => void
  user: AuthUser
  notificationsTo: string
}

export function Header({ onMenuClick, user, notificationsTo }: HeaderProps) {
  const { unreadCount } = useNotifications()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden text-sm text-slate-500 sm:block">
          Welcome back,{' '}
          <span className="font-semibold text-slate-900">{user.name.split(' ')[0]}</span>
          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {capitalize(user.role.toLowerCase())}
          </span>
        </div>
      </div>
      <Link
        to={notificationsTo}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </Link>
    </header>
  )
}