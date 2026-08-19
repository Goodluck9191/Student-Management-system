import { useState } from 'react'
import { Bell, CheckCheck, ClipboardList, Megaphone, Settings } from 'lucide-react'
import { useNotifications } from '../../context/NotificationsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import type { NotificationItem, NotificationType } from '../../types/notification'
import { formatDate } from '../../lib/format'

const typeMeta: Record<NotificationType, { label: string; icon: typeof Bell; tone: 'green' | 'violet' | 'slate' }> = {
  result: { label: 'Results', icon: ClipboardList, tone: 'green' },
  announcement: { label: 'Announcement', icon: Megaphone, tone: 'violet' },
  system: { label: 'System', icon: Settings, tone: 'slate' },
}

export function NotificationsPage() {
  const { notifications, loading, markRead, markAllRead } = useNotifications()
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? notifications.filter((notification) =>
        filter === 'unread' ? !notification.read : notification.type === filter,
      )
    : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      await markRead(notification.id)
    }
  }

  if (loading) {
    return <LoadingState label="Loading notifications…" />
  }

  if (notifications.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Notifications" subtitle="Messages and updates for your account" />
        <Card>
          <EmptyState title="No notifications yet" message="New notifications will appear here." />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Messages and updates for your account"
        action={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={() => void markAllRead()}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
          <FilterButton label="All" active={filter === ''} onClick={() => setFilter('')} />
          <FilterButton label="Unread" active={filter === 'unread'} onClick={() => setFilter('unread')} />
          <FilterButton label="Results" active={filter === 'result'} onClick={() => setFilter('result')} />
          <FilterButton label="Announcements" active={filter === 'announcement'} onClick={() => setFilter('announcement')} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No notifications here" message="Try a different filter." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((notification) => {
              const meta = typeMeta[notification.type]
              const Icon = meta.icon
              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => void handleClick(notification)}
                    className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        notification.read
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-brand-50 text-brand-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </span>
                        <Badge label={meta.label} tone={meta.tone} dot={false} />
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-600">
                        {notification.message}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">
                        {formatDate(notification.date)}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  )
}