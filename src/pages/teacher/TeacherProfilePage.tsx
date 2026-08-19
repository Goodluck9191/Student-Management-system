import type { ReactNode } from 'react'
import { Mail, Phone, BadgeCheck, BookOpen, Building2 } from 'lucide-react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { Badge } from '../../components/ui/Badge'
import { teacherName } from '../../lib/format'
import { TEACHER_STATUS_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'

export function TeacherProfilePage() {
  const { teacher, user } = useTeacherIdentity()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  const subjectMap = toRecord(subjects)
  const classMap = toRecord(classes)
  const mySubjects = teacher.subjectIds.map((id) => subjectMap[id]).filter(Boolean)
  const myClasses = teacher.classIds.map((id) => classMap[id]).filter(Boolean)

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Your staff information" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
            Teacher Profile
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">{teacherName(teacher)}</h2>
          <p className="mt-1 text-sm text-brand-100">
            {teacher.employeeNumber} · {TEACHER_STATUS_LABELS[teacher.status]}
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
          <ProfileRow icon={<BadgeCheck className="h-4 w-4" />} label="Employee Number" value={teacher.employeeNumber} />
          <ProfileRow icon={<Mail className="h-4 w-4" />} label="Email" value={teacher.email} />
          <ProfileRow icon={<Phone className="h-4 w-4" />} label="Phone" value={teacher.phone} />
          <ProfileRow icon={<BadgeCheck className="h-4 w-4" />} label="Account Status" value={TEACHER_STATUS_LABELS[teacher.status]} />
        </dl>
        {user && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{user.email}</span> · Role: {user.role}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Subjects</h2>
          </div>
          <div className="flex flex-wrap gap-2 p-5">
            {mySubjects.length === 0 ? (
              <p className="text-sm text-slate-500">No subjects assigned.</p>
            ) : (
              mySubjects.map((subject) => (
                <Badge key={subject.id} label={subject.name} tone="sky" />
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Classes</h2>
          </div>
          <div className="flex flex-wrap gap-2 p-5">
            {myClasses.length === 0 ? (
              <p className="text-sm text-slate-500">No classes assigned.</p>
            ) : (
              myClasses.map((schoolClass) => (
                <Badge key={schoolClass.id} label={schoolClass.name} tone="violet" />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function ProfileRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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