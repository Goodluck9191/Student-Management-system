import type { StudentStatus } from '../../types/student'
import { STATUS_LABELS } from '../../lib/constants'

const statusStyles: Record<StudentStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  graduated: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  suspended: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  transferred: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

const dotStyles: Record<StudentStatus, string> = {
  active: 'bg-emerald-500',
  graduated: 'bg-sky-500',
  suspended: 'bg-amber-500',
  transferred: 'bg-slate-400',
}

export function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
