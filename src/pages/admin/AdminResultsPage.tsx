import { useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Megaphone, Send } from 'lucide-react'
import { useResults } from '../../context/ResultsContext'
import { useStudents } from '../../context/StudentsContext'
import { useSubjects } from '../../context/SubjectsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ResultsTable } from '../../components/results/ResultsTable'
import { Pagination } from '../../components/ui/Pagination'
import { useToast } from '../../components/ui/Toast'
import type { Result } from '../../types/result'
import { PAGE_SIZE, TERM_LABELS } from '../../lib/constants'
import { fullName } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

export function AdminResultsPage() {
  const { results, loading, error, refresh, approve, publish, remove } = useResults()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { showToast } = useToast()

  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [term, setTerm] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<Result | null>(null)

  const studentNames = useMemo(() => toRecord(students), [students])
  const subjectNames = useMemo(() => toRecord(subjects), [subjects])

  const filtered = useMemo(() => {
    return results.filter((result) => {
      const matchesStudent = studentId === '' || result.studentId === studentId
      const matchesSubject = subjectId === '' || result.subjectId === subjectId
      const matchesTerm = term === '' || result.term === Number(term)
      const matchesStatus = status === '' || result.status === status
      return matchesStudent && matchesSubject && matchesTerm && matchesStatus
    })
  }, [results, studentId, subjectId, term, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const clearFilters = () => {
    setStudentId('')
    setSubjectId('')
    setTerm('')
    setStatus('')
    setPage(1)
  }

  const handleApprove = async (result: Result) => {
    try {
      await approve(result.id)
      showToast('Result approved.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to approve result.', 'error')
    }
  }

  const handlePublish = async (result: Result) => {
    try {
      await publish(result.id)
      showToast('Result published. Parents can now view it.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to publish result.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await remove(deleting.id)
      showToast('Result deleted.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete result.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading results…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  const hasFilters = studentId !== '' || subjectId !== '' || term !== '' || status !== ''

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        subtitle="Review, approve and publish results"
      />

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm">
        <WorkflowStep icon={<Send className="h-3.5 w-3.5" />} label="Draft" tone="text-slate-500" />
        <ArrowStep />
        <WorkflowStep icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Submitted" tone="text-amber-600" />
        <ArrowStep />
        <WorkflowStep icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Approved" tone="text-blue-600" />
        <ArrowStep />
        <WorkflowStep icon={<Megaphone className="h-3.5 w-3.5" />} label="Published" tone="text-emerald-600" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by student"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {fullName(student)}
                </option>
              ))}
            </select>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by subject"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <select
              value={term}
              onChange={(e) => {
                setTerm(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by term"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All terms</option>
              {Object.entries(TERM_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by status"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No results match your filters' : 'No results yet'}
            message={hasFilters ? 'Try clearing the filters.' : 'Results appear once teachers enter them.'}
          />
        ) : (
          <>
            <ResultsTable
              results={pageItems}
              studentNames={Object.fromEntries(Object.entries(studentNames).map(([id, s]) => [id, fullName(s)]))}
              subjectNames={Object.fromEntries(Object.entries(subjectNames).map(([id, s]) => [id, s.name]))}
              onApprove={handleApprove}
              onPublish={handlePublish}
              onDelete={setDeleting}
            />
            <div className="border-t border-slate-100">
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete result"
        message="Are you sure you want to delete this result? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

function WorkflowStep({ icon, label, tone }: { icon: ReactNode; label: string; tone: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${tone}`}>
      {icon}
      {label}
    </span>
  )
}

function ArrowStep() {
  return <span className="text-slate-300" aria-hidden="true">→</span>
}