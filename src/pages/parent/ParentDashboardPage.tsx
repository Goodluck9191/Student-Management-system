import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  ClipboardList,
  GraduationCap,
  Megaphone,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useResults } from '../../context/ResultsContext'
import { useAnnouncements } from '../../context/AnnouncementsContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { Button } from '../../components/ui/Button'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { Badge } from '../../components/ui/Badge'
import { ResultStatusBadge } from '../../components/results/ResultStatusBadge'
import { fullName, parentName, round } from '../../lib/format'
import { SCHOOL_NAME, TERM_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'

export function ParentDashboardPage() {
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()
  const { results } = useResults()
  const { items: announcements } = useAnnouncements()

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  const classMap = toRecord(classes)
  const children = students.filter((student) => parent.studentIds.includes(student.id))
  const childIds = new Set(children.map((c) => c.id))

  const publishedResults = results.filter(
    (result) => childIds.has(result.studentId) && result.status === 'published',
  )

  const publishedAnnouncements = announcements.filter(
    (a) =>
      a.status === 'published' &&
      (a.audience === 'all' || a.audience === 'parents'),
  )

  const averageFor = (studentId: string): number | null => {
    const list = publishedResults.filter((r) => r.studentId === studentId)
    if (list.length === 0) return null
    return round(list.reduce((sum, r) => sum + r.marks, 0) / list.length)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
              Parent Portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Karibu, {parentName(parent).split(' ')[0]}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-brand-100">
              Follow your children's academic journey at {SCHOOL_NAME}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/parent/results">
              <Button variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                View Results
              </Button>
            </Link>
            <Link to="/parent/performance">
              <Button variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
                Performance
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Children" value={children.length} icon={Users} iconClassName="bg-brand-50 text-brand-600" />
        <StatCard label="Published Results" value={publishedResults.length} icon={ClipboardList} iconClassName="bg-amber-50 text-amber-600" />
        <StatCard label="Announcements" value={publishedAnnouncements.length} icon={Megaphone} iconClassName="bg-sky-50 text-sky-600" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader
            title="My Children"
            subtitle="Students linked to your account"
            action={
              <Link to="/parent/children" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {children.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              No children are linked to your account yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {children.map((student) => {
                const average = averageFor(student.id)
                return (
                  <li key={student.id}>
                    <Link
                      to={`/parent/children/${student.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                    >
                      <StudentAvatar student={student} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {fullName(student)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {classMap[student.classId]?.name ?? '—'} · {student.admissionNumber}
                        </p>
                      </div>
                      {average !== null ? (
                        <Badge label={`Avg ${average}%`} tone="green" />
                      ) : (
                        <Badge label="No results" tone="slate" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent Results"
            subtitle="Latest published results"
            action={
              <Link to="/parent/results" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {publishedResults.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              No published results yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {publishedResults.slice(0, 5).map((result) => {
                const student = students.find((s) => s.id === result.studentId)
                return (
                  <li key={result.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <GraduationCap className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {student ? fullName(student) : '—'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {TERM_LABELS[result.term]} · {result.academicYear} · {result.marks}%
                      </p>
                    </div>
                    <ResultStatusBadge status={result.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Announcements"
            subtitle="Latest news for parents"
            action={
              <Link to="/parent/announcements" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {publishedAnnouncements.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              No announcements yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {publishedAnnouncements.slice(0, 3).map((announcement) => (
                <li key={announcement.id} className="px-5 py-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Bell className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="truncate">{announcement.title}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}