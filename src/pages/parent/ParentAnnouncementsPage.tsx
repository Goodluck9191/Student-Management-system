import { useMemo, useState } from 'react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useAnnouncements } from '../../context/AnnouncementsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { AnnouncementCard } from '../../components/announcements/AnnouncementCard'
import { Badge } from '../../components/ui/Badge'
import { toRecord } from '../../lib/selectors'

export function ParentAnnouncementsPage() {
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()
  const { items: announcements, loading, error, refresh } = useAnnouncements()

  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('')
  const [scope, setScope] = useState('')

  const classMap = useMemo(() => toRecord(classes), [classes])

  const children = useMemo(() => {
    if (!parent) return []
    return students.filter((student) => parent.studentIds.includes(student.id))
  }, [students, parent])

  const childClassIds = useMemo(() => new Set(children.map((c) => c.classId)), [children])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...announcements]
      .filter((announcement) => announcement.status === 'published')
      .filter((announcement) => {
        if (announcement.audience === 'teachers' || announcement.audience === 'students') return false
        if (announcement.audience === 'class') {
          if (!announcement.audienceClassId) return false
          if (!childClassIds.has(announcement.audienceClassId)) return false
        }
        return true
      })
      .filter((announcement) => {
        const matchesSearch = term === '' || announcement.title.toLowerCase().includes(term)
        const matchesPriority = priority === '' || announcement.priority === priority
        const matchesScope =
          scope === '' ||
          (scope === 'all' && announcement.audience === 'all') ||
          (scope === 'parents' && announcement.audience === 'parents') ||
          (scope === 'class' && announcement.audience === 'class')
        return matchesSearch && matchesPriority && matchesScope
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [announcements, search, priority, scope, childClassIds])

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  if (loading) {
    return <LoadingState label="Loading announcements…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  const hasFilters = search !== '' || priority !== '' || scope !== ''

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="News published to you by the school"
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements…"
            aria-label="Search announcements"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            aria-label="Filter by audience"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All audiences</option>
            <option value="all">Everyone</option>
            <option value="parents">Parents</option>
            <option value="class">My children's classes</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Filter by priority"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All priorities</option>
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setScope('')
                setPriority('')
              }}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No announcements match your filters' : 'No announcements yet'}
            message={hasFilters ? 'Try clearing the filters.' : 'Announcements will appear here when the school publishes them.'}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
            {visible.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        {children.map((child) => (
          <Badge key={child.id} label={`${child.firstName} ${child.lastName} · ${classMap[child.classId]?.name ?? '—'}`} tone="slate" dot={false} />
        ))}
      </div>
    </div>
  )
}