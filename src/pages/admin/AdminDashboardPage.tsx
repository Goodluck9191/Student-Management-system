import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
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
import { ResultStatusBadge } from '../../components/results/ResultStatusBadge'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/format'
import { SCHOOL_NAME, SCHOOL_MOTTO, TERM_LABELS } from '../../lib/constants'
import { SubjectBarChart } from '../../components/charts/SubjectBarChart'
import {
  computeClassPerformance,
  computeSchoolSummary,
  computeSubjectPerformance,
  filterPublishedResults,
  groupPublishedResults,
} from '../../lib/analytics'

const recentActivity = [
  { id: 'act1', text: 'James Mwakapamba submitted results for Form 2A Mathematics.', time: '2 hours ago' },
  { id: 'act2', text: 'Term 2 results were published to the parent portal.', time: 'Yesterday' },
  { id: 'act3', text: 'New student was registered in Form 1A.', time: 'Yesterday' },
  { id: 'act4', text: 'Parent account was created for Omary Mwangosi.', time: '2 days ago' },
  { id: 'act5', text: 'Announcement "Parent Meeting" was published.', time: '3 days ago' },
  { id: 'act6', text: 'Sarah Kimaro was assigned to Form 1A.', time: '4 days ago' },
]

function viewAllLink(to: string) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
    >
      View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  )
}

export function AdminDashboardPage() {
  const { students } = useStudents()
  const { items: teachers } = useTeachers()
  const { items: parents } = useParents()
  const { items: classes } = useClasses()
  const { items: subjects } = useSubjects()
  const { results } = useResults()
  const { items: announcements } = useAnnouncements()

  const publishedResults = useMemo(() => filterPublishedResults(results), [results])
  const summary = useMemo(() => computeSchoolSummary(publishedResults), [publishedResults])
  const subjectPerformance = useMemo(
    () => computeSubjectPerformance(publishedResults, subjects),
    [publishedResults, subjects],
  )
  const classPerformance = useMemo(
    () => computeClassPerformance(publishedResults, students, classes),
    [publishedResults, students, classes],
  )
  const recentPublishedGroups = useMemo(
    () => groupPublishedResults(publishedResults, students, subjects, classes).slice(0, 4),
    [publishedResults, students, subjects, classes],
  )

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
            <Link to="/admin/students/new">
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
        <StatCard label="Total Students" value={students.length} icon={Users} iconClassName="bg-brand-50 text-brand-600" to="/admin/students" />
        <StatCard label="Total Teachers" value={teachers.length} icon={UserCog} iconClassName="bg-sky-50 text-sky-600" to="/admin/teachers" />
        <StatCard label="Total Parents" value={parents.length} icon={HeartHandshake} iconClassName="bg-pink-50 text-pink-600" to="/admin/parents" />
        <StatCard label="Total Classes" value={classes.length} icon={Building2} iconClassName="bg-violet-50 text-violet-600" to="/admin/classes" />
        <StatCard
          label="Active Students"
          value={students.filter((s) => s.status === 'active').length}
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-600"
          to="/admin/students?status=active"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="School Average"
          value={summary.average}
          icon={TrendingUp}
          iconClassName="bg-indigo-50 text-indigo-600"
          hint="Published results"
          to="/admin/results/analytics"
        />
        <StatCard
          label="Pass Rate"
          value={summary.passRate}
          suffix="%"
          icon={Award}
          iconClassName="bg-emerald-50 text-emerald-600"
          hint="Marks at or above 50%"
          to="/admin/results/analytics"
        />
        <StatCard
          label="Published Results"
          value={summary.count}
          icon={ClipboardList}
          iconClassName="bg-amber-50 text-amber-600"
          hint="Visible to parents"
          to="/admin/results?status=published"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader
            title="Recent Published Results by Subject"
            subtitle="Latest subject results released to parents"
            action={viewAllLink('/admin/results?status=published')}
          />
          {recentPublishedGroups.length === 0 ? (
            <EmptyState
              title="No published results yet"
              message="Subjects appear here once results are published."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentPublishedGroups.map((group) => (
                <li key={group.key} className="flex items-start gap-3 px-5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{group.subjectName}</p>
                    <p className="text-xs text-slate-500">
                      {group.className} · {TERM_LABELS[group.term]} · {group.academicYear}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {group.studentCount} {group.studentCount === 1 ? 'student' : 'students'}
                      {group.publishedAt ? ` · Published ${formatDate(group.publishedAt)}` : ''}
                    </p>
                  </div>
                  <ResultStatusBadge status="published" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col">
          <CardHeader
            title="Recent Announcements"
            subtitle="Latest published news"
            action={viewAllLink('/admin/announcements')}
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

        <Card className="flex flex-col md:col-span-2 lg:col-span-1">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Performance by Subject" subtitle="Average marks across published results" />
          <div className="p-4">
            {subjectPerformance.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No published results yet.</p>
            ) : (
              <SubjectBarChart
                data={subjectPerformance}
                ariaLabel="Bar chart of average marks by subject"
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
              <SubjectBarChart
                data={classPerformance}
                ariaLabel="Bar chart of average marks by class"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
