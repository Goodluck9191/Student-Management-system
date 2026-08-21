import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, ClipboardList, TrendingUp } from 'lucide-react'
import { useResults } from '../../context/ResultsContext'
import { useStudents } from '../../context/StudentsContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { Button } from '../../components/ui/Button'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { SubjectBarChart } from '../../components/charts/SubjectBarChart'
import {
  computeClassPerformance,
  computeSchoolSummary,
  computeSubjectPerformance,
  filterPublishedResults,
} from '../../lib/analytics'

export function AdminResultsAnalyticsPage() {
  const { results, loading, error, refresh } = useResults()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()

  const publishedResults = useMemo(() => filterPublishedResults(results), [results])
  const summary = useMemo(() => computeSchoolSummary(publishedResults), [publishedResults])
  const subjectPerformance = useMemo(
    () => computeSubjectPerformance(publishedResults, subjects),
    [publishedResults, subjects],
  )
  const classPerformance = useMemo(
    () => computeClassPerformance(publishedResults, students, classes),
    [publishedResults, students, classes],
  )

  if (loading) {
    return <LoadingState label="Loading analytics…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results Analytics"
        subtitle="School-wide performance across published results"
        action={
          <Link to="/admin/results">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to results
            </Button>
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="School Average"
          value={summary.average}
          icon={TrendingUp}
          iconClassName="bg-indigo-50 text-indigo-600"
          hint={`${summary.count} published ${summary.count === 1 ? 'result' : 'results'}`}
        />
        <StatCard
          label="Pass Rate"
          value={summary.passRate}
          suffix="%"
          icon={Award}
          iconClassName="bg-emerald-50 text-emerald-600"
          hint="Marks at or above 50%"
        />
        <StatCard
          label="Published Results"
          value={summary.count}
          icon={ClipboardList}
          iconClassName="bg-amber-50 text-amber-600"
          hint="Visible to parents"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Performance by Subject" subtitle="Average marks across published results" />
          <div className="p-4">
            {subjectPerformance.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No published results yet.</p>
            ) : (
              <SubjectBarChart
                data={subjectPerformance}
                ariaLabel="Bar chart of average marks by subject"
              />
            )}
          </div>
        </Card>
        <Card>
          <CardHeader title="Performance by Class" subtitle="Average marks across published results" />
          <div className="p-4">
            {classPerformance.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No published results yet.</p>
            ) : (
              <SubjectBarChart
                data={classPerformance}
                ariaLabel="Bar chart of average marks by class"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
