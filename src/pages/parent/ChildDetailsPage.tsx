import { Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useResults } from '../../context/ResultsContext'
import { Card, CardHeader } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { Button } from '../../components/ui/Button'
import { ResultsTable } from '../../components/results/ResultsTable'
import { Badge } from '../../components/ui/Badge'
import { fullName, formatDate, round } from '../../lib/format'
import { GENDER_LABELS, STATUS_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'

export function ChildDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()
  const { items: subjects } = useSubjects()
  const { results } = useResults()

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  const student = students.find((s) => s.id === id)
  const isChild = student ? parent.studentIds.includes(student.id) : false

  if (!student || !isChild) {
    return (
      <div>
        <ErrorState message="Student not found or not linked to your account." />
        <div className="flex justify-center">
          <Link to="/parent/children">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to my children
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const classMap = toRecord(classes)
  const subjectMap = toRecord(subjects)
  const publishedResults = results.filter(
    (r) => r.studentId === student.id && r.status === 'published',
  )
  const sortedResults = [...publishedResults].sort((a, b) =>
    `${b.academicYear}-${b.term}`.localeCompare(`${a.academicYear}-${a.term}`),
  )
  const average =
    publishedResults.length === 0
      ? null
      : round(publishedResults.reduce((sum, r) => sum + r.marks, 0) / publishedResults.length)

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/parent/children"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          My children
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <StudentAvatar student={student} size="lg" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
                Student Profile
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{fullName(student)}</h1>
              <p className="text-sm text-brand-100">
                {classMap[student.classId]?.name ?? '—'} · {student.admissionNumber}
              </p>
            </div>
          </div>
          {average !== null && (
            <Badge label={`Overall average ${average}%`} tone="green" />
          )}
        </div>
        <dl className="grid grid-cols-1 gap-x-6 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-y-0">
          <InfoItem icon={<CalendarDays className="h-4 w-4" />} label="Date of Birth" value={formatDate(student.dateOfBirth)} />
          <InfoItem icon={<GraduationCap className="h-4 w-4" />} label="Gender" value={GENDER_LABELS[student.gender]} />
          <InfoItem icon={<MapPin className="h-4 w-4" />} label="Address" value={student.address || '—'} />
        </dl>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-6 py-3">
          <Badge label={STATUS_LABELS[student.status]} tone={student.status === 'active' ? 'green' : 'slate'} />
          <Badge label={`Combination: ${student.combination}`} tone="violet" dot={false} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/parent/results?student=${student.id}`}>
          <Button variant="outline">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Results
          </Button>
        </Link>
        <Link to={`/parent/performance?student=${student.id}`}>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Performance
          </Button>
        </Link>
        <Link to={`/parent/attendance?student=${student.id}`}>
          <Button variant="outline">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Attendance
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Published Results"
          subtitle="Results released by the school"
          action={
            <Link
              to="/parent/results"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all
            </Link>
          }
        />
        <ResultsTable
          results={sortedResults.slice(0, 10)}
          studentNames={{ [student.id]: fullName(student) }}
          subjectNames={Object.fromEntries(
            Object.entries(subjectMap).map(([subjectId, subject]) => [subjectId, subject.name]),
          )}
          emptyMessage="No published results for this student yet."
        />
      </Card>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
        <dd className="truncate text-sm font-medium text-slate-900">{value}</dd>
      </div>
    </div>
  )
}