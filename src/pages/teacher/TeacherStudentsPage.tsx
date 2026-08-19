import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { EmptyState } from '../../components/ui/EmptyState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { Pagination } from '../../components/ui/Pagination'
import { fullName } from '../../lib/format'
import { GENDER_LABELS, PAGE_SIZE } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'

export function TeacherStudentsPage() {
  const { teacher } = useTeacherIdentity()
  const { students, loading, error, refresh } = useStudents()
  const { items: classes } = useClasses()

  const [search, setSearch] = useState('')
  const [classId, setClassId] = useState('')
  const [page, setPage] = useState(1)

  const classMap = useMemo(() => toRecord(classes), [classes])

  const myStudents = useMemo(() => {
    if (!teacher) return []
    return students.filter((student) => teacher.classIds.includes(student.classId))
  }, [students, teacher])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return myStudents.filter((student) => {
      const matchesSearch =
        term === '' ||
        fullName(student).toLowerCase().includes(term) ||
        student.admissionNumber.toLowerCase().includes(term)
      const matchesClass = classId === '' || student.classId === classId
      return matchesSearch && matchesClass
    })
  }, [myStudents, search, classId])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  if (loading) {
    return <LoadingState label="Loading students…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Students"
        subtitle="Students in the classes you teach"
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
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name or admission number…"
              aria-label="Search students"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
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
            {teacher.classIds.map((id) => (
              <option key={id} value={id}>
                {classMap[id]?.name ?? id}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No students found" message="No students match your search." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold">Student</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Admission No.</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Gender</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Class</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageItems.map((student) => (
                    <tr key={student.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-3">
                          <StudentAvatar student={student} size="sm" />
                          <span className="font-medium text-slate-900">{fullName(student)}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">
                        {student.admissionNumber}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{GENDER_LABELS[student.gender]}</td>
                      <td className="px-5 py-3 text-slate-600">
                        {classMap[student.classId]?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={student.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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