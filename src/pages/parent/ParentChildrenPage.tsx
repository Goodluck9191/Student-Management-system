import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useResults } from '../../context/ResultsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { Badge } from '../../components/ui/Badge'
import { fullName, round } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

export function ParentChildrenPage() {
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()
  const { results } = useResults()

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  const classMap = toRecord(classes)
  const children = students.filter((student) => parent.studentIds.includes(student.id))

  const averageFor = (studentId: string): number | null => {
    const list = results.filter(
      (r) => r.studentId === studentId && r.status === 'published',
    )
    if (list.length === 0) return null
    return round(list.reduce((sum, r) => sum + r.marks, 0) / list.length)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Children"
        subtitle="Students linked to your account"
      />

      {children.length === 0 ? (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            No children are linked to your account yet. Please contact the school administration.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((student) => {
            const average = averageFor(student.id)
            return (
              <Link
                key={student.id}
                to={`/parent/children/${student.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <StudentAvatar student={student} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{fullName(student)}</p>
                    <p className="text-xs text-slate-500">{student.admissionNumber}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Class</dt>
                    <dd className="font-medium text-slate-800">
                      {classMap[student.classId]?.name ?? '—'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Status</dt>
                    <dd className="font-medium capitalize text-slate-800">{student.status}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Published average</dt>
                    <dd>
                      {average !== null ? (
                        <Badge label={`${average}%`} tone={average >= 50 ? 'green' : 'red'} />
                      ) : (
                        <Badge label="No results" tone="slate" />
                      )}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                  View profile
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
              </Link>
            )
          })}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-slate-500">
          You can only view information for the children linked to your account. Results are
          visible only after the school has published them.
        </p>
      </div>
    </div>
  )
}