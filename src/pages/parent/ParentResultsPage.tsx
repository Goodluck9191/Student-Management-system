import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useParentIdentity } from '../../hooks/useParentIdentity'
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
import { fullName } from '../../lib/format'
import { PAGE_SIZE, TERM_LABELS, TERMS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'
import type { Term } from '../../types/result'

export function ParentResultsPage() {
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()
  const { results, loading, error, refresh } = useResults()

  const [searchParams, setSearchParams] = useSearchParams()
  const [studentId, setStudentId] = useState(searchParams.get('student') ?? '')
  const [subjectId, setSubjectId] = useState('')
  const [term, setTerm] = useState<Term | ''>('')
  const [page, setPage] = useState(1)

  const studentMap = useMemo(() => toRecord(students), [students])
  const subjectMap = useMemo(() => toRecord(subjects), [subjects])
  const classMap = useMemo(() => toRecord(classes), [classes])

  const children = useMemo(() => {
    if (!parent) return []
    return students.filter((student) => parent.studentIds.includes(student.id))
  }, [students, parent])
  const childIds = useMemo(() => new Set(children.map((c) => c.id)), [children])

  const publishedResults = useMemo(
    () => results.filter((r) => childIds.has(r.studentId) && r.status === 'published'),
    [results, childIds],
  )

  const filtered = useMemo(() => {
    return [...publishedResults]
      .sort((a, b) => `${b.academicYear}-${b.term}`.localeCompare(`${a.academicYear}-${a.term}`))
      .filter((result) => {
        const matchesStudent = studentId === '' || result.studentId === studentId
        const matchesSubject = subjectId === '' || result.subjectId === subjectId
        const matchesTerm = term === '' || result.term === term
        return matchesStudent && matchesSubject && matchesTerm
      })
  }, [publishedResults, studentId, subjectId, term])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const hasFilters = studentId !== '' || subjectId !== '' || term !== ''

  const updateStudent = (value: string) => {
    setStudentId(value)
    setPage(1)
    if (value === '') {
      searchParams.delete('student')
    } else {
      searchParams.set('student', value)
    }
    setSearchParams(searchParams, { replace: true })
  }

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  if (loading) {
    return <LoadingState label="Loading results…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        subtitle="Published results for your children"
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4 sm:p-5">
          <select
            value={studentId}
            onChange={(e) => updateStudent(e.target.value)}
            aria-label="Filter by child"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All children</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {fullName(child)}
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
            {Object.values(subjectMap).map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <select
            value={term}
            onChange={(e) => {
              setTerm(e.target.value === '' ? '' : (Number(e.target.value) as Term))
              setPage(1)
            }}
            aria-label="Filter by term"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All terms</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {TERM_LABELS[t]}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                updateStudent('')
                setSubjectId('')
                setTerm('')
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
            title={hasFilters ? 'No results match your filters' : 'No published results yet'}
            message={
              hasFilters
                ? 'Try clearing the filters.'
                : 'Results will appear here once the school publishes them.'
            }
          />
        ) : (
          <>
            <ResultsTable
              results={pageItems}
              studentNames={Object.fromEntries(
                Object.entries(studentMap).map(([id, s]) => [id, fullName(s)]),
              )}
              subjectNames={Object.fromEntries(
                Object.entries(subjectMap).map(([id, s]) => [id, s.name]),
              )}
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

      {children.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => (
            <span key={child.id} className="text-xs text-slate-500">
              {fullName(child)} · {classMap[child.classId]?.name ?? '—'}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}