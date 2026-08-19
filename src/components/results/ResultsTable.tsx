import type { ReactNode } from 'react'
import { Check, Megaphone, Send, Trash2 } from 'lucide-react'
import type { Result } from '../../types/result'
import { ResultStatusBadge } from './ResultStatusBadge'
import { TERM_LABELS } from '../../lib/constants'

interface ResultsTableProps {
  results: Result[]
  studentNames: Record<string, string>
  subjectNames: Record<string, string>
  onSend?: (result: Result) => void
  onApprove?: (result: Result) => void
  onPublish?: (result: Result) => void
  onDelete?: (result: Result) => void
  emptyMessage?: string
}

export function ResultsTable({
  results,
  studentNames,
  subjectNames,
  onSend,
  onApprove,
  onPublish,
  onDelete,
  emptyMessage = 'No results found.',
}: ResultsTableProps) {
  const hasActions = Boolean(onSend || onApprove || onPublish || onDelete)

  if (results.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-slate-500">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="px-5 py-3 font-semibold">Student</th>
            <th scope="col" className="px-5 py-3 font-semibold">Subject</th>
            <th scope="col" className="px-5 py-3 font-semibold">Term</th>
            <th scope="col" className="px-5 py-3 font-semibold">Year</th>
            <th scope="col" className="px-5 py-3 font-semibold">Marks</th>
            <th scope="col" className="px-5 py-3 font-semibold">Grade</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            {hasActions && (
              <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((result) => {
            const isDraft = result.status === 'draft'
            const isSubmitted = result.status === 'submitted'
            const isApproved = result.status === 'approved'
            return (
              <tr key={result.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {studentNames[result.studentId] ?? '—'}
                </td>
                <td className="px-5 py-3 text-slate-600">{subjectNames[result.subjectId] ?? '—'}</td>
                <td className="px-5 py-3 text-slate-600">{TERM_LABELS[result.term]}</td>
                <td className="px-5 py-3 text-slate-600">{result.academicYear}</td>
                <td className="px-5 py-3 font-semibold text-slate-900">{result.marks}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {result.grade}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <ResultStatusBadge status={result.status} />
                </td>
                {hasActions && (
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isDraft && onSend && (
                        <ActionButton
                          label="Submit"
                          icon={<Send className="h-4 w-4" />}
                          onClick={() => onSend(result)}
                        />
                      )}
                      {isSubmitted && onApprove && (
                        <ActionButton
                          label="Approve"
                          icon={<Check className="h-4 w-4" />}
                          onClick={() => onApprove(result)}
                        />
                      )}
                      {isApproved && onPublish && (
                        <ActionButton
                          label="Publish"
                          icon={<Megaphone className="h-4 w-4" />}
                          onClick={() => onPublish(result)}
                        />
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(result)}
                          aria-label="Delete result"
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50"
    >
      {icon}
      {label}
    </button>
  )
}