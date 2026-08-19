import { useMemo, useState } from 'react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { useResults } from '../../context/ResultsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { ResultsTable } from '../../components/results/ResultsTable'
import { Pagination } from '../../components/ui/Pagination'
import { useToast } from '../../components/ui/Toast'
import { PAGE_SIZE } from '../../lib/constants'
import { fullName } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

export function TeacherResultsPage() {
  const { teacher } = useTeacherIdentity()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()
  const { results, loading, error, refresh, submit } = useResults()
  const { showToast } = useToast()

  const [subjectId, setSubjectId] = useState('')
  const [classId, setClassId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const studentMap = useMemo(() => toRecord(students), [students])
  const subjectMap = useMemo(() => toRecord(subjects), [subjects])
  const classMap = useMemo(() => toRecord(classes), [classes])

  const myResults = useMemo(() => {
    if (!teacher) return []
    const myStudentIds = new Set(
      students.filter((s) => teacher.classIds.includes(s.classId)).map((s) => s.id),
    )
    return results.filter(
      (result) =>
        teacher.subjectIds.includes(result.subjectId) && myStudentIds.has(result.studentId),
    )
  }, [results, students, teacher])

  const filtered = useMemo(() => {
    return myResults.filter((result) => {
      const student = studentMap[result.studentId]
      const matchesSubject = subjectId === '' || result.subjectId === subjectId
      const matchesClass = classId === '' || (student && student.classId === classId)
      const matchesStatus = status === '' || result.status === status
      return matchesSubject && matchesClass && matchesStatus
    })
  }, [myResults, subjectId, classId, status, studentMap])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSubmit = async (resultId: string) => {
    try {
      await submit(resultId)
      showToast('Result submitted for approval.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to submit result.', 'error')
    }
  }

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  if (loading) {
    return <LoadingState label="Loading results…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  const myClasses = teacher.classIds
  const hasFilters = subjectId !== '' || classId !== '' || status !== ''

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        subtitle="Results for the classes and subjects you teach"
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4 sm:p-5">
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by subject"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All my subjects</option>
            {teacher.subjectIds.map((id) => (
              <option key={id} value={id}>
                {subjectMap[id]?.name ?? id}
              </option>
            ))}
          </select>
          <select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by class"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All my classes</option>
            {myClasses.map((id) => (
              <option key={id} value={id}>
                {classMap[id]?.name ?? id}
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
              onClick={() => {
                setSubjectId('')
                setClassId('')
                setStatus('')
                setPage(1)
              }}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No results match your filters' : 'No results yet'}
            message={hasFilters ? 'Try clearing the filters.' : 'Enter results to get started.'}
          />
        ) : (
          <>
            <ResultsTable
              results={pageItems}
              studentNames={Object.fromEntries(Object.entries(studentMap).map(([id, s]) => [id, fullName(s)]))}
              subjectNames={Object.fromEntries(Object.entries(subjectMap).map(([id, s]) => [id, s.name]))}
              onSend={(result) => void handleSubmit(result.id)}
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
    </div>
  )
}