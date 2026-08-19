import { GraduationCap } from 'lucide-react'
import { SCHOOL_SHORT_NAME } from '../../lib/constants'

export function SchoolLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </span>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-900">{SCHOOL_SHORT_NAME}</p>
          <p className="text-[11px] text-slate-500">Student Management</p>
        </div>
      )}
    </div>
  )
}
