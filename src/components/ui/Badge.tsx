import type { ReactNode } from 'react'

export type BadgeTone =
  | 'green'
  | 'red'
  | 'amber'
  | 'blue'
  | 'violet'
  | 'slate'
  | 'sky'
  | 'pink'

const toneStyles: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  pink: 'bg-pink-50 text-pink-700 ring-pink-600/20',
}

const dotStyles: Record<BadgeTone, string> = {
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-400',
  sky: 'bg-sky-500',
  pink: 'bg-pink-500',
}

export function Badge({
  label,
  tone = 'slate',
  dot = true,
}: {
  label: ReactNode
  tone?: BadgeTone
  dot?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneStyles[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[tone]}`} aria-hidden="true" />}
      {label}
    </span>
  )
}