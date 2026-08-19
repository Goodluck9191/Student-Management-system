import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useSubjects } from '../../context/SubjectsContext'
import { useTeachers } from '../../context/TeachersContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { SubjectForm } from '../../components/subjects/SubjectForm'
import { useToast } from '../../components/ui/Toast'
import type { Subject, SubjectInput } from '../../types/subject'
import { teacherName } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

export function AdminSubjectsPage() {
  const { items: subjects, loading, error, refresh, create, update, remove } = useSubjects()
  const { items: teachers } = useTeachers()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [deleting, setDeleting] = useState<Subject | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const teacherMap = useMemo(() => toRecord(teachers), [teachers])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return subjects.filter((subject) => {
      const matchesSearch =
        term === '' || subject.name.toLowerCase().includes(term) || subject.code.toLowerCase().includes(term)
      const matchesLevel = level === '' || subject.level === level
      return matchesSearch && matchesLevel
    })
  }, [subjects, search, level])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (subject: Subject) => {
    setEditing(subject)
    setModalOpen(true)
  }

  const handleSubmit = async (values: SubjectInput) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        const updated = await update(editing.id, values)
        showToast(`${updated.name} was updated successfully.`)
      } else {
        const created = await create(values)
        showToast(`${created.name} was added successfully.`)
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save subject.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await remove(deleting.id)
      showToast(`${deleting.name} was removed.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete subject.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading subjects…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        subtitle="Manage school subjects"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Subject
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
              placeholder="Search subjects…"
              aria-label="Search subjects"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            aria-label="Filter by level"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All levels</option>
            <option value="O">Ordinary Level</option>
            <option value="A">Advanced Level</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No subjects found" message="Add a subject to get started." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((subject) => (
              <li key={subject.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 font-mono text-xs font-bold text-brand-700">
                  {subject.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{subject.name}</p>
                  <p className="text-xs text-slate-500">
                    {subject.level === 'O' ? 'Ordinary Level' : 'Advanced Level'}
                  </p>
                </div>
                <div className="hidden max-w-xs flex-wrap gap-1.5 md:flex">
                  {subject.teacherIds.slice(0, 3).map((id) => {
                    const teacher = teacherMap[id]
                    return teacher ? (
                      <Badge key={id} label={teacherName(teacher)} tone="blue" dot={false} />
                    ) : null
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(subject)}
                    aria-label={`Edit ${subject.name}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(subject)}
                    aria-label={`Delete ${subject.name}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Subject' : 'Add Subject'}>
        <SubjectForm
          initialValues={editing ?? undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete subject"
        message={`Are you sure you want to delete ${deleting?.name ?? ''}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}