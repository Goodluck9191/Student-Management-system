import { Mail, MapPin, Phone, Users } from 'lucide-react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { Badge } from '../../components/ui/Badge'
import { fullName, parentName } from '../../lib/format'
import { PARENT_STATUS_LABELS, RELATIONSHIP_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'
import type { ReactNode } from 'react'

export function ParentProfilePage() {
  const { parent, user } = useParentIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  const classMap = toRecord(classes)
  const children = students.filter((student) => parent.studentIds.includes(student.id))

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Your account information" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
            Parent / Guardian
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">{parentName(parent)}</h2>
          <p className="mt-1 text-sm text-brand-100">
            {RELATIONSHIP_LABELS[parent.relationship]} · {PARENT_STATUS_LABELS[parent.status]}
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
          <ProfileRow icon={<Mail className="h-4 w-4" />} label="Email" value={parent.email} />
          <ProfileRow icon={<Phone className="h-4 w-4" />} label="Phone" value={parent.phone} />
          <ProfileRow icon={<MapPin className="h-4 w-4" />} label="Address" value={parent.address} />
          <ProfileRow icon={<Users className="h-4 w-4" />} label="Children" value={`${children.length}`} />
        </dl>
        {user && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{user.email}</span> · Role: {user.role}
          </div>
        )}
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">My Children</h2>
        </div>
        <div className="p-5">
          {children.length === 0 ? (
            <p className="text-sm text-slate-500">No children are linked to your account yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {children.map((child) => (
                <li key={child.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{fullName(child)}</p>
                    <p className="text-xs text-slate-500">
                      {child.admissionNumber} · {classMap[child.classId]?.name ?? '—'}
                    </p>
                  </div>
                  <Badge label={child.status} tone={child.status === 'active' ? 'green' : 'slate'} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
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