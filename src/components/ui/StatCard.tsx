import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconClassName?: string
  hint?: string
  /** When provided the whole card becomes a router link to this path. */
  to?: string
  /** Optional unit rendered after the value, e.g. "%". */
  suffix?: string
}

const cardClasses =
  'group relative block w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 cursor-pointer'

function StatCardBody({
  label,
  value,
  icon: Icon,
  iconClassName,
  hint,
  suffix,
  interactive,
}: {
  label: string
  value: number
  icon: LucideIcon
  iconClassName: string
  hint?: string
  suffix?: string
  interactive: boolean
}) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {value}
            {suffix && <span className="text-xl font-semibold text-slate-500">{suffix}</span>}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconClassName}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {interactive && (
        <ArrowUpRight
          className="absolute bottom-4 right-4 h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-500"
          aria-hidden="true"
        />
      )}
    </>
  )
}

export function StatCard({
  label,
  value,
  icon,
  iconClassName = 'bg-brand-50 text-brand-600',
  hint,
  to,
  suffix,
}: StatCardProps): ReactNode {
  if (to) {
    return (
      <Link to={to} className={cardClasses} aria-label={`${label} — view details`}>
        <StatCardBody
          label={label}
          value={value}
          icon={icon}
          iconClassName={iconClassName}
          hint={hint}
          suffix={suffix}
          interactive
        />
      </Link>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <StatCardBody
        label={label}
        value={value}
        icon={icon}
        iconClassName={iconClassName}
        hint={hint}
        suffix={suffix}
        interactive={false}
      />
    </div>
  )
}
