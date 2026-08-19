import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Award, BookOpen, MessageSquareQuote, TrendingDown, TrendingUp } from 'lucide-react'
import { useParentIdentity } from '../../hooks/useParentIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { useResults } from '../../context/ResultsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { StatCard } from '../../components/ui/StatCard'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { PerformanceChart } from '../../components/charts/PerformanceChart'
import { SubjectBarChart } from '../../components/charts/SubjectBarChart'
import { Badge } from '../../components/ui/Badge'
import { fullName, gradeForMarks, round } from '../../lib/format'
import { TERM_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'

interface TermPoint {
  label: string
  average: number
}

export function ParentPerformancePage() {
  const { parent } = useParentIdentity()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()
  const { results, loading, error, refresh } = useResults()

  const [searchParams, setSearchParams] = useSearchParams()

  const children = useMemo(() => {
    if (!parent) return []
    return students.filter((student) => parent.studentIds.includes(student.id))
  }, [students, parent])

  const childIds = useMemo(() => new Set(children.map((c) => c.id)), [children])

  const publishedResults = useMemo(
    () => results.filter((r) => childIds.has(r.studentId) && r.status === 'published'),
    [results, childIds],
  )

  const initialStudentId = searchParams.get('student') ?? children[0]?.id ?? ''
  const [selectedId, setSelectedId] = useState(initialStudentId)
  const selected = children.find((child) => child.id === selectedId) ?? children[0] ?? null

  const selectedResults = useMemo(
    () => publishedResults.filter((r) => r.studentId === selected?.id),
    [publishedResults, selected],
  )

  const classMap = useMemo(() => toRecord(classes), [classes])
  const subjectMap = useMemo(() => toRecord(subjects), [subjects])

  const trend: TermPoint[] = useMemo(() => {
    const byTerm = new Map<string, number[]>()
    for (const result of selectedResults) {
      const key = `${result.academicYear}-T${result.term}`
      const list = byTerm.get(key) ?? []
      list.push(result.marks)
      byTerm.set(key, list)
    }
    return [...byTerm.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, marks]) => ({
        label: key,
        average: round(marks.reduce((sum, m) => sum + m, 0) / marks.length),
      }))
  }, [selectedResults])

  const latestTermKey = trend[trend.length - 1]?.label ?? ''
  const subjectMarks = useMemo(() => {
    if (latestTermKey === '') return []
    const [yearRaw, termRaw] = latestTermKey.split('-T')
    const term = Number(termRaw)
    return selectedResults
      .filter((r) => r.academicYear === yearRaw && r.term === term)
      .map((r) => ({
        subject: subjectMap[r.subjectId]?.name ?? r.subjectId,
        marks: r.marks,
      }))
  }, [selectedResults, latestTermKey, subjectMap])

  const perSubjectAverage = useMemo(() => {
    const bySubject = new Map<string, number[]>()
    for (const result of selectedResults) {
      const list = bySubject.get(result.subjectId) ?? []
      list.push(result.marks)
      bySubject.set(result.subjectId, list)
    }
    return [...bySubject.entries()]
      .map(([subjectId, marks]) => ({
        subjectId,
        subjectName: subjectMap[subjectId]?.name ?? subjectId,
        average: round(marks.reduce((sum, m) => sum + m, 0) / marks.length),
        count: marks.length,
      }))
      .sort((a, b) => b.average - a.average)
  }, [selectedResults, subjectMap])

  const strongest = perSubjectAverage[0] ?? null
  const weakest = perSubjectAverage[perSubjectAverage.length - 1] ?? null

  const overallAverage =
    selectedResults.length === 0
      ? null
      : round(selectedResults.reduce((sum, r) => sum + r.marks, 0) / selectedResults.length)
  const bestMark = selectedResults.length === 0 ? null : Math.max(...selectedResults.map((r) => r.marks))

  const comments = useMemo(() => {
    return [...selectedResults]
      .sort((a, b) => `${b.academicYear}-${b.term}`.localeCompare(`${a.academicYear}-${a.term}`))
      .filter((r) => r.teacherComment.trim() !== '')
  }, [selectedResults])

  if (!parent) {
    return <ErrorState message="No parent profile is linked to this account." />
  }

  if (loading) {
    return <LoadingState label="Loading performance data…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  const selectChild = (childId: string) => {
    setSelectedId(childId)
    setSearchParams({ student: childId }, { replace: true })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        subtitle="Academic performance of your children"
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
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Overall Average" value={overallAverage ?? 0} hint={overallAverage !== null ? `${overallAverage}%` : 'No results yet'} icon={TrendingUp} iconClassName="bg-brand-50 text-brand-600" />
            <StatCard label="Subjects" value={perSubjectAverage.length} icon={BookOpen} iconClassName="bg-sky-50 text-sky-600" />
            <StatCard label="Best Mark" value={bestMark ?? 0} hint={bestMark !== null ? `${bestMark}%` : 'No results yet'} icon={Award} iconClassName="bg-amber-50 text-amber-600" />
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Performance Trend" subtitle="Average marks per term across published results" />
              {trend.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">
                  No published results yet for {fullName(selected)}.
                </p>
              ) : (
                <div className="p-5 pt-2">
                  <PerformanceChart data={trend} />
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Latest Term by Subject" subtitle={latestTermKey !== '' ? `Breakdown for ${latestTermKey.replace('-T', ' · Term ')}` : 'Breakdown of marks'} />
              {subjectMarks.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">No data yet.</p>
              ) : (
                <div className="p-5 pt-2">
                  <SubjectBarChart data={subjectMarks} />
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader title="Strongest Subject" subtitle="Highest average across published results" />
              <div className="p-5">
                {strongest ? (
                  <div>
                    <p className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
                      {strongest.subjectName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Average <span className="font-semibold text-slate-800">{strongest.average}%</span>{' '}
                      across {strongest.count} result{strongest.count === 1 ? '' : 's'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No data yet.</p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Subject to Improve" subtitle="Lowest average across published results" />
              <div className="p-5">
                {weakest ? (
                  <div>
                    <p className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      <TrendingDown className="h-5 w-5 text-red-500" aria-hidden="true" />
                      {weakest.subjectName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Average <span className="font-semibold text-slate-800">{weakest.average}%</span>{' '}
                      across {weakest.count} result{weakest.count === 1 ? '' : 's'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No data yet.</p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Class" subtitle="Current class of this student" />
              <div className="p-5">
                <p className="text-base font-semibold text-slate-900">
                  {classMap[selected.classId]?.name ?? '—'}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Admission {selected.admissionNumber}
                </p>
                <div className="mt-3">
                  <Badge label={selected.combination} tone="violet" dot={false} />
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Teacher Comments" subtitle="Feedback from teachers on published results" />
            {comments.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No comments yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {comments.slice(0, 8).map((result) => (
                  <li key={result.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">{result.teacherComment}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {subjectMap[result.subjectId]?.name ?? '—'} · {TERM_LABELS[result.term]}{' '}
                        {result.academicYear} · {result.marks}% · Grade {gradeForMarks(result.marks)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <p className="text-sm text-slate-500">
            Only results published by the school are shown. For detailed results, visit{' '}
            <Link to="/parent/results" className="font-medium text-brand-600 hover:text-brand-700">
              Results
            </Link>
            .
          </p>
        </>
      )}
    </div>
  )
}