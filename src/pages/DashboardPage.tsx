import { Link } from 'react-router-dom'
import {
  Users,
  UserCheck,
  UserPlus,
  ArrowRight,
  GraduationCap,
  CircleUserRound,
} from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { LoadingState, ErrorState } from '../components/ui/States'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { StudentAvatar } from '../components/ui/StudentAvatar'
import { Button } from '../components/ui/Button'
import { fullName, formatDate } from '../lib/format'
import { SCHOOL_NAME, SCHOOL_MOTTO } from '../lib/constants'

export function DashboardPage() {
  const { students, loading, error, refresh } = useStudents()

  if (loading) {
    return <LoadingState label="Loading dashboard…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  const total = students.length
  const male = students.filter((s) => s.gender === 'male').length
  const female = students.filter((s) => s.gender === 'female').length
  const active = students.filter((s) => s.status === 'active').length
  const recent = students.slice(0, 5)

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
              Manage student records, registrations and academic information from one simple
              dashboard.
            </p>
          </div>
          <Link to="/students/new" className="shrink-0">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50"
            >
              <UserPlus className="h-5 w-5" aria-hidden="true" />
              Add Student
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={total}
          icon={Users}
          iconClassName="bg-brand-50 text-brand-600"
        />
        <StatCard
          label="Male Students"
          value={male}
          icon={CircleUserRound}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Female Students"
          value={female}
          icon={CircleUserRound}
          iconClassName="bg-pink-50 text-pink-600"
        />
        <StatCard
          label="Active Students"
          value={active}
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </section>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Students</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              The most recently registered students
            </p>
          </div>
          <Link
            to="/students"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No students yet"
            message="Register your first student to get started."
            action={
              <Link to="/students/new">
                <Button>
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  Add Student
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((student) => (
              <li key={student.id}>
                <Link
                  to={`/students/${student.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <StudentAvatar student={student} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {fullName(student)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {student.admissionNumber} · {student.className}
                    </p>
                  </div>
                  <div className="hidden sm:flex sm:items-center sm:gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                      {student.combination}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(student.enrollmentDate)}
                    </span>
                    <StatusBadge status={student.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}