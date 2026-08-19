import { CalendarDays, Megaphone } from 'lucide-react'
import type { Announcement } from '../../types/announcement'
import {
  ANNOUNCEMENT_AUDIENCE_LABELS,
  ANNOUNCEMENT_PRIORITY_LABELS,
} from '../../lib/constants'
import { Badge, type BadgeTone } from '../ui/Badge'
import { formatDate } from '../../lib/format'

const priorityTone: Record<Announcement['priority'], BadgeTone> = {
  normal: 'slate',
  important: 'amber',
  urgent: 'red',
}

const audienceTone: Record<Announcement['audience'], BadgeTone> = {
  all: 'violet',
  students: 'blue',
  parents: 'green',
  teachers: 'sky',
  class: 'pink',
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold text-slate-900">{announcement.title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {announcement.status === 'draft' && <Badge label="Draft" tone="slate" />}
          <Badge label={ANNOUNCEMENT_PRIORITY_LABELS[announcement.priority]} tone={priorityTone[announcement.priority]} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{announcement.message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <Badge
          label={ANNOUNCEMENT_AUDIENCE_LABELS[announcement.audience]}
          tone={audienceTone[announcement.audience]}
        />
        <span className="font-medium text-slate-700">{announcement.authorName}</span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(announcement.date)}
        </span>
      </div>
    </article>
  )
}