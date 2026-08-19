import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  ClipboardList,
  HeartHandshake,
  Megaphone,
  UserCog,
  UserPlus,
  Users,
  UserCheck,
  TrendingUp,
  Award,
} from 'lucide-react'
import { useStudents } from '../../context/StudentsContext'
import { useTeachers } from '../../context/TeachersContext'
import { useParents } from '../../context/ParentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useResults } from '../../context/ResultsContext'
import { useAnnouncements } from '../../context/AnnouncementsContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { ResultStatusBadge } from '../../components/results/ResultStatusBadge'
import { Button } from '../../components/ui/Button'
import { fullName, formatDate, round } from '../../lib/format'
import { SCHOOL_NAME, SCHOOL_MOTTO, TERM_LABELS } from '../../lib/constants'
import { SubjectBarChart } from '../../components/charts/SubjectBarChart'
import { toRecord } from '../../lib/selectors'

const recentActivity = [
  { id: 'act1', text: 'James Mwakapamba submitted results for Form 2A Mathematics.', time: '2 hours ago' },
  { id: 'act2', text: 'Term 2 results were published to the parent portal.', time: 'Yesterday' },
  { id: 'act3', text: 'New parent account created for Omary Mwangosi.', time: '2 days ago' },
  { id: 'act4', text: 'Announcement "Parent Meeting" published.', time: '3 days ago' },
]

export function AdminDashboardPage() {
  const { students } = useStudents()
  const { items: teachers } = useTeachers()
  const { items: parents } = useParents()
  const { items: classes } = useClasses()
  const { items: subjects } = useSubjects()
  const { results } = useResults()
  const { items: announcements } = useAnnouncements()

  const publishedResults = results.filter((r) => r.status === 'published')
  const schoolAverage = publishedResults.length
    ? round(publishedResults.reduce((sum, r) => sum + r.marks, 0) / publishedResults.length)
    : 0
  const passRate = publishedResults.length
    ? round((publishedResults.filter((r) => r.marks >= 50).length / publishedResults.length) * 100)
    : 0

  const classMap = toRecord(classes)
  const subjectAverages = new Map<string, { total: number; count: number }>()
  const classAverages = new Map<string, { total: number; count: number }>()
  const studentMap = toRecord(students)

  publishedResults.forEach((result) => {
    const subject = subjectAverages.get(result.subjectId) ?? { total: 0, count: 0 }
    subject.total += result.marks
    subject.count += 1
    subjectAverages.set(result.subjectId, subject)

    const student = studentMap[result.studentId]
    if (student) {
      const entry = classAverages.get(student.classId) ?? { total: 0, count: 0 }
      entry.total += result.marks
      entry.count += 1
      classAverages.set(student.classId, entry)
    }
  })

  const subjectPerformance = [...subjectAverages.entries()]
    .map(([subjectId, { total, count }]) => ({
      subject: subjectId,
      marks: round(total / count),
    }))
    .sort((a, b) => b.marks - a.marks)

  const subjectNames = toRecord(subjects)
  const classPerformance = [...classAverages.entries()]
    .map(([classId, { total, count }]) => ({
      subject: classMap[classId]?.name ?? classId,
      marks: round(total / count),
    }))
    .sort((a, b) => b.marks - a.marks)

  const recentStudents = [...students]
    .sort((a, b) => b.enrollmentDate.localeCompare(a.enrollmentDate))
    .slice(0, 5)
  const recentResults = results.slice(0, 5)
  const recentAnnouncements = [...announcements]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
              {SCHOOL_MOTTO}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to {SCHOOL_NAME}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-brand-100">
              School overview, academic performance and management tools in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/students/create">
              <Button variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                <UserPlus className="h-5 w-5" aria-hidden="true" />
                Add Student
              </Button>
            </Link>
            <Link to="/admin/announcements">
              <Button variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                <Megaphone className="h-5 w-5" aria-hidden="true" />
                Announcement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Students" value={students.length} icon={Users} iconClassName="bg-brand-50 text-brand-600" />
        <StatCard label="Total Teachers" value={teachers.length} icon={UserCog} iconClassName="bg-sky-50 text-sky-600" />
        <StatCard label="Total Parents" value={parents.length} icon={HeartHandshake} iconClassName="bg-pink-50 text-pink-600" />
        <StatCard label="Total Classes" value={classes.length} icon={Building2} iconClassName="bg-violet-50 text-violet-600" />
        <StatCard
          label="Active Students"
          value={students.filter((s) => s.status === 'active').length}
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="School Average" value={schoolAverage} icon={TrendingUp} iconClassName="bg-indigo-50 text-indigo-600" hint="Published results" />
        <StatCard label="Pass Rate" value={passRate} icon={Award} iconClassName="bg-emerald-50 text-emerald-600" hint="Marks at or above 50%" />
        <StatCard label="Published Results" value={publishedResults.length} icon={ClipboardList} iconClassName="bg-amber-50 text-amber-600" hint="Visible to parents" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Performance by Subject" subtitle="Average marks across published results" />
          <div className="p-4">
            {subjectPerformance.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No published results yet.</p>
            ) : (
              <SubjectBarChart
                data={subjectPerformance.map((item) => ({
                  subject: subjectNames[item.subject]?.name ?? item.subject,
                  marks: item.marks,
                }))}
              />
            )}
          </div>
        </Card>
        <Card>
          <CardHeader title="Performance by Class" subtitle="Average marks across published results" />
          <div className="p-4">
            {classPerformance.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No published results yet.</p>
            ) : (
              <SubjectBarChart data={classPerformance} />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader
            title="Recent Students"
            subtitle="Latest registrations"
            action={
              <Link to="/admin/students" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {recentStudents.length === 0 ? (
            <EmptyState title="No students yet" message="Register your first student to get started." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentStudents.map((student) => (
                <li key={student.id}>
                  <Link
                    to={`/admin/students/${student.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                  >
                    <StudentAvatar student={student} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{fullName(student)}</p>
                      <p className="text-xs text-slate-500">
                        {student.admissionNumber} · {classMap[student.classId]?.name ?? '—'}
                      </p>
                    </div>
                    <StatusBadge status={student.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent Results" subtitle="Latest entered results" />
          {recentResults.length === 0 ? (
            <EmptyState title="No results yet" message="Results will appear once teachers enter them." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentResults.slice(0, 5).map((result) => (
                <li key={result.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {studentMap[result.studentId] ? fullName(studentMap[result.studentId]) : '—'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {TERM_LABELS[result.term]} · {result.academicYear} · {result.marks} marks
                    </p>
                  </div>
                  <ResultStatusBadge status={result.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent Announcements"
            subtitle="Latest published news"
            action={
              <Link to="/admin/announcements" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {recentAnnouncements.length === 0 ? (
            <EmptyState title="No announcements yet" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentAnnouncements.map((announcement) => (
                <li key={announcement.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-slate-900">{announcement.title}</p>
                  <p className="text-xs text-slate-500">
                    {announcement.authorName} · {formatDate(announcement.date)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent System Activity" subtitle="Latest actions across the system" />
        <ul className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="flex items-start gap-3 px-5 py-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm text-slate-700">{activity.text}</p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}