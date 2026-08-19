import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlarmClockOff, CalendarCheck, CalendarClock, Clock } from 'lucide-react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { StatCard } from '../../components/ui/StatCard'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { getAttendanceForStudent, getAttendanceSummary, type TermAttendance } from '../../data/mock/attendance'
import { TERM_LABELS } from '../../lib/constants'
import { fullName } from '../../lib/format'

function attendanceRate(record: TermAttendance): number {
  return record.total === 0 ? 0 : Math.round((record.present / record.total) * 100)
}

export function ParentAttendancePage() {
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()

  const [searchParams, setSearchParams] = useSearchParams()

  const children = useMemo(() => {
    if (!parent) return []
    return students.filter((student) => parent.studentIds.includes(student.id))
  }, [students, parent])

  const initialStudentId = searchParams.get('student') ?? children[0]?.id ?? ''
  const [selectedId, setSelectedId] = useState(initialStudentId)
  const selected = children.find((child) => child.id === selectedId) ?? children[0] ?? null

  const classMap = useMemo(() => toRecordLocal(classes), [classes])

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  const records = selected ? getAttendanceForStudent(selected.id) : []
  const summary = selected ? getAttendanceSummary(selected.id) : null

  const selectChild = (childId: string) => {
    setSelectedId(childId)
    setSearchParams({ student: childId }, { replace: true })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        subtitle="School attendance records for your children"
      />

      {children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => {
            const active = selected?.id === child.id
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => selectChild(child.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <StudentAvatar student={child} size="sm" />
                {fullName(child)}
              </button>
            )
          })}
        </div>
      )}

      {!selected ? (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            No children are linked to your account yet.
          </p>
        </Card>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Attendance Rate" value={summary?.attendanceRate ?? 0} hint={summary ? `${summary.attendanceRate}%` : 'No data'} icon={CalendarCheck} iconClassName="bg-emerald-50 text-emerald-600" />
            <StatCard label="Days Present" value={summary?.present ?? 0} icon={CalendarCheck} iconClassName="bg-brand-50 text-brand-600" />
            <StatCard label="Days Absent" value={summary?.absent ?? 0} icon={AlarmClockOff} iconClassName="bg-red-50 text-red-600" />
            <StatCard label="Times Late" value={summary?.late ?? 0} icon={Clock} iconClassName="bg-amber-50 text-amber-600" />
          </section>

          <Card>
            <CardHeader
              title="Attendance by Term"
              subtitle={`${fullName(selected)} · ${classMap[selected.classId]?.name ?? '—'}`}
            />
            {records.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No attendance records.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th scope="col" className="px-5 py-3 font-semibold">Term</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Year</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Present</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Absent</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Late</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Total Days</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((record) => {
                      const rate = attendanceRate(record)
                      const rateLabel = `${rate}%`
                      return (
                        <tr key={`${record.academicYear}-${record.term}`} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-medium text-slate-900">
                            {TERM_LABELS[record.term]}
                          </td>
                          <td className="px-5 py-3 text-slate-600">{record.academicYear}</td>
                          <td className="px-5 py-3 text-slate-700">{record.present}</td>
                          <td className="px-5 py-3 text-slate-700">{record.absent}</td>
                          <td className="px-5 py-3 text-slate-700">{record.late}</td>
                          <td className="px-5 py-3 text-slate-600">{record.total}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 font-medium ${
                                rate >= 90 ? 'text-emerald-600' : rate >= 75 ? 'text-amber-600' : 'text-red-600'
                              }`}
                            >
                              <CalendarClock className="h-4 w-4" aria-hidden="true" />
                              {rateLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {summary && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Overall attendance rate</p>
                <p className="text-sm font-semibold text-slate-900">{summary.attendanceRate}%</p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    summary.attendanceRate >= 90
                      ? 'bg-emerald-500'
                      : summary.attendanceRate >= 75
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, summary.attendanceRate)}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function toRecordLocal<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]))
}