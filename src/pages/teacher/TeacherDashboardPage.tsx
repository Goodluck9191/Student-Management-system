import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardList,
  ClipboardPen,
  Megaphone,
  Users,
} from 'lucide-react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { useResults } from '../../context/ResultsContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { Button } from '../../components/ui/Button'
import { ResultStatusBadge } from '../../components/results/ResultStatusBadge'
import { teacherName, fullName } from '../../lib/format'
import { TERM_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'
import { SCHOOL_NAME } from '../../lib/constants'

export function TeacherDashboardPage() {
  const { teacher } = useTeacherIdentity()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()
  const { results } = useResults()

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  const classMap = toRecord(classes)
  const subjectMap = toRecord(subjects)
  const studentMap = toRecord(students)

  const myClasses = teacher.classIds.map((id) => classMap[id]).filter(Boolean)
  const mySubjects = teacher.subjectIds.map((id) => subjectMap[id]).filter(Boolean)

  const myStudentIds = new Set(
    students.filter((student) => teacher.classIds.includes(student.classId)).map((s) => s.id),
  )
  const myStudents = students.filter((student) => myStudentIds.has(student.id))

  const myResults = results.filter(
    (result) =>
      teacher.subjectIds.includes(result.subjectId) && myStudentIds.has(result.studentId),
  )
  const draftCount = myResults.filter((r) => r.status === 'draft').length

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
              Teacher Portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome, {teacher ? teacherName(teacher).split(' ')[0] : 'Teacher'}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-brand-100">
              Manage academic activities for your assigned classes and subjects at {SCHOOL_NAME}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/teacher/results/enter">
              <Button variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                <ClipboardPen className="h-5 w-5" aria-hidden="true" />
                Enter Results
              </Button>
            </Link>
            <Link to="/teacher/announcements">
              <Button variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                <Megaphone className="h-5 w-5" aria-hidden="true" />
                Create Announcement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Students" value={myStudents.length} icon={Users} iconClassName="bg-brand-50 text-brand-600" />
        <StatCard label="My Classes" value={myClasses.length} icon={Building2} iconClassName="bg-violet-50 text-violet-600" />
        <StatCard label="My Subjects" value={mySubjects.length} icon={BookOpen} iconClassName="bg-sky-50 text-sky-600" />
        <StatCard label="Draft Results" value={draftCount} icon={ClipboardList} iconClassName="bg-amber-50 text-amber-600" hint="Awaiting submission" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="My Classes" subtitle="Classes you teach" />
          {myClasses.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No classes assigned.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myClasses.map((schoolClass) => {
                const count = students.filter((s) => s.classId === schoolClass.id).length
                return (
                  <li key={schoolClass.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{schoolClass.name}</p>
                      <p className="text-xs text-slate-500">{count} students</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="My Subjects" subtitle="Subjects you teach" />
          {mySubjects.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No subjects assigned.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {mySubjects.map((subject) => (
                <li key={subject.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{subject.name}</p>
                    <p className="text-xs text-slate-500">{subject.code}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="My Recent Results"
            subtitle="Latest results you entered"
            action={
              <Link to="/teacher/results" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {myResults.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No results yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myResults.slice(0, 5).map((result) => {
                const student = studentMap[result.studentId]
                return (
                  <li key={result.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <ClipboardList className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {student ? fullName(student) : '—'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {TERM_LABELS[result.term]} · {subjectMap[result.subjectId]?.name ?? '—'} ·{' '}
                        {result.marks} marks
                      </p>
                    </div>
                    <ResultStatusBadge status={result.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/teacher/students">
          <Button variant="outline">
            <Users className="h-4 w-4" aria-hidden="true" />
            View Students
          </Button>
        </Link>
        <Link to="/teacher/results">
          <Button variant="outline">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            View Results
          </Button>
        </Link>
        <Link to="/teacher/classes">
          <Button variant="outline">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            My Classes
          </Button>
        </Link>
      </div>
    </div>
  )
}