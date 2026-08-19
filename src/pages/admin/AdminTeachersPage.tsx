import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, UserCog } from 'lucide-react'
import { useTeachers } from '../../context/TeachersContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { TeacherForm } from '../../components/teachers/TeacherForm'
import { NameAvatar } from '../../components/ui/NameAvatar'
import { useToast } from '../../components/ui/Toast'
import type { Teacher, TeacherInput } from '../../types/teacher'
import { TEACHER_STATUS_LABELS } from '../../lib/constants'
import { teacherName } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

export function AdminTeachersPage() {
  const { items: teachers, loading, error, refresh, create, update, remove } = useTeachers()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [deleting, setDeleting] = useState<Teacher | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subjectMap = useMemo(() => toRecord(subjects), [subjects])
  const classMap = useMemo(() => toRecord(classes), [classes])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return teachers.filter((teacher) => {
      const matchesSearch =
        term === '' ||
        teacherName(teacher).toLowerCase().includes(term) ||
        teacher.email.toLowerCase().includes(term) ||
        teacher.employeeNumber.toLowerCase().includes(term)
      const matchesStatus = status === '' || teacher.status === status
      return matchesSearch && matchesStatus
    })
  }, [teachers, search, status])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher)
    setModalOpen(true)
  }

  const handleSubmit = async (values: TeacherInput) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        const updated = await update(editing.id, values)
        showToast(`${teacherName(updated)} was updated successfully.`)
      } else {
        const created = await create(values)
        showToast(`${teacherName(created)} was added successfully.`)
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save teacher.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await remove(deleting.id)
      showToast(`${teacherName(deleting)} was removed.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete teacher.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const toggleStatus = async (teacher: Teacher) => {
    const next = teacher.status === 'active' ? 'inactive' : 'active'
    try {
      await update(teacher.id, { status: next })
      showToast(`${teacherName(teacher)} is now ${TEACHER_STATUS_LABELS[next].toLowerCase()}.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update status.', 'error')
    }
  }

  if (loading) {
    return <LoadingState label="Loading teachers…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        subtitle="Manage teaching staff, subject and class assignments"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Teacher
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
              placeholder="Search by name, email or employee number…"
              aria-label="Search teachers"
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
          <EmptyState title="No teachers found" message="Add a teacher to get started." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((teacher) => (
              <li key={teacher.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <NameAvatar name={teacherName(teacher)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {teacherName(teacher)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {teacher.employeeNumber} · {teacher.email}
                  </p>
                </div>
                <div className="hidden max-w-xs flex-wrap gap-1.5 md:flex">
                  {teacher.subjectIds.slice(0, 3).map((id) => (
                    <Badge key={id} label={subjectMap[id]?.name ?? id} tone="blue" dot={false} />
                  ))}
                  {teacher.subjectIds.length > 3 && (
                    <Badge label={`+${teacher.subjectIds.length - 3}`} tone="slate" dot={false} />
                  )}
                </div>
                <div className="hidden max-w-xs flex-wrap gap-1.5 md:flex">
                  {teacher.classIds.slice(0, 3).map((id) => (
                    <Badge key={id} label={classMap[id]?.name ?? id} tone="violet" dot={false} />
                  ))}
                </div>
                <Badge
                  label={TEACHER_STATUS_LABELS[teacher.status]}
                  tone={teacher.status === 'active' ? 'green' : 'slate'}
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => void toggleStatus(teacher)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    <UserCog className="h-4 w-4" aria-hidden="true" />
                    {teacher.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(teacher)}
                    aria-label={`Edit ${teacherName(teacher)}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(teacher)}
                    aria-label={`Delete ${teacherName(teacher)}`}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Teacher' : 'Add Teacher'}
      >
        <TeacherForm
          initialValues={editing ?? undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete teacher"
        message={`Are you sure you want to delete ${deleting ? teacherName(deleting) : ''}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}