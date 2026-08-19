import { useMemo, useState } from 'react'
import { Plus, Send, Trash2 } from 'lucide-react'
import { useAnnouncements } from '../../context/AnnouncementsContext'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { AnnouncementCard } from '../../components/announcements/AnnouncementCard'
import { AnnouncementForm } from '../../components/announcements/AnnouncementForm'
import { useToast } from '../../components/ui/Toast'
import { teacherName } from '../../lib/format'
import type { Announcement, AnnouncementInput } from '../../types/announcement'

export function TeacherAnnouncementsPage() {
  const { items: announcements, loading, error, refresh, create, update, remove } = useAnnouncements()
  const { teacher } = useTeacherIdentity()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [deleting, setDeleting] = useState<Announcement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...announcements]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((announcement) => {
        const matchesSearch = term === '' || announcement.title.toLowerCase().includes(term)
        const matchesStatus = status === '' || announcement.status === status
        return matchesSearch && matchesStatus
      })
  }, [announcements, search, status])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (announcement: Announcement) => {
    setEditing(announcement)
    setModalOpen(true)
  }

  const handleSubmit = async (values: AnnouncementInput) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        const updated = await update(editing.id, values)
        showToast(`${updated.title} was updated successfully.`)
      } else {
        const created = await create(values)
        showToast(`${created.title} was created successfully.`)
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save announcement.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async (announcement: Announcement) => {
    try {
      const nextStatus = announcement.status === 'published' ? 'draft' : 'published'
      await update(announcement.id, { status: nextStatus })
      showToast(
        nextStatus === 'published'
          ? `"${announcement.title}" was published.`
          : `"${announcement.title}" was un-published.`,
      )
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update announcement.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await remove(deleting.id)
      showToast('Announcement deleted.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete announcement.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading announcements…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Create and manage school announcements"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Announcement
          </Button>
        }
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No announcements found"
            message="Create an announcement to share news with parents, students and teachers."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
            {filtered.map((announcement) => (
              <div key={announcement.id} className="relative">
                <AnnouncementCard announcement={announcement} />
                <div className="mt-2 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => void handlePublish(announcement)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    {announcement.status === 'published' ? 'Un-publish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(announcement)}
                    className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(announcement)}
                    aria-label="Delete announcement"
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Announcement' : 'Create Announcement'}
      >
        <AnnouncementForm
          initialValues={editing ?? undefined}
          authorId={teacher?.id ?? ''}
          authorName={teacher ? teacherName(teacher) : ''}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete announcement"
        message={`Are you sure you want to delete "${deleting?.title ?? ''}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}