import { useMemo, useState } from 'react'
import { Pencil, Phone, Plus, Search, Trash2 } from 'lucide-react'
import { useParents } from '../../context/ParentsContext'
import { useStudents } from '../../context/StudentsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { ParentForm } from '../../components/parents/ParentForm'
import { NameAvatar } from '../../components/ui/NameAvatar'
import { useToast } from '../../components/ui/Toast'
import type { Parent, ParentInput } from '../../types/parent'
import { PARENT_STATUS_LABELS, RELATIONSHIP_LABELS } from '../../lib/constants'
import { fullName, parentName } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

export function AdminParentsPage() {
  const { items: parents, loading, error, refresh, create, update, remove } = useParents()
  const { students } = useStudents()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Parent | null>(null)
  const [deleting, setDeleting] = useState<Parent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const studentMap = useMemo(() => toRecord(students), [students])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return parents.filter((parent) => {
      const matchesSearch =
        term === '' ||
        parentName(parent).toLowerCase().includes(term) ||
        parent.email.toLowerCase().includes(term) ||
        parent.phone.toLowerCase().includes(term)
      const matchesStatus = status === '' || parent.status === status
      return matchesSearch && matchesStatus
    })
  }, [parents, search, status])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (parent: Parent) => {
    setEditing(parent)
    setModalOpen(true)
  }

  const handleSubmit = async (values: ParentInput) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        const updated = await update(editing.id, values)
        showToast(`${parentName(updated)} was updated successfully.`)
      } else {
        const created = await create(values)
        showToast(`${parentName(created)} was added successfully.`)
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save parent.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await remove(deleting.id)
      showToast(`${parentName(deleting)} was removed.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete parent.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading parents…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents & Guardians"
        subtitle="Manage parent accounts and link them to students"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Parent
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone…"
              aria-label="Search parents"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No parents found" message="Add a parent account to get started." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((parent) => {
              const children = parent.studentIds.map((id) => studentMap[id]).filter(Boolean)
              return (
                <li key={parent.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <NameAvatar name={parentName(parent)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {parentName(parent)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {RELATIONSHIP_LABELS[parent.relationship]} · {parent.email}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {parent.phone}
                    </p>
                  </div>
                  <div className="max-w-xs">
                    {children.length === 0 ? (
                      <Badge label="No children linked" tone="amber" />
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {children.slice(0, 3).map((child) => (
                          <Badge key={child.id} label={fullName(child)} tone="blue" dot={false} />
                        ))}
                        {children.length > 3 && (
                          <Badge label={`+${children.length - 3} more`} tone="slate" dot={false} />
                        )}
                      </div>
                    )}
                  </div>
                  <Badge
                    label={PARENT_STATUS_LABELS[parent.status]}
                    tone={parent.status === 'active' ? 'green' : 'slate'}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(parent)}
                      aria-label={`Edit ${parentName(parent)}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(parent)}
                      aria-label={`Delete ${parentName(parent)}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Parent / Guardian' : 'Add Parent / Guardian'}
      >
        <ParentForm
          initialValues={editing ?? undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete parent"
        message={`Are you sure you want to delete ${deleting ? parentName(deleting) : ''}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}