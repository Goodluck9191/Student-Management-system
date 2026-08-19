import { BookOpen } from 'lucide-react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { Badge } from '../../components/ui/Badge'
import { toRecord } from '../../lib/selectors'
import type { Subject } from '../../types/subject'

export function TeacherSubjectsPage() {
  const { teacher } = useTeacherIdentity()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  const classMap = toRecord(classes)

  const mySubjects = teacher.subjectIds
    .map((id) => subjects.find((s) => s.id === id))
    .filter((subject): subject is Subject => Boolean(subject))

  return (
    <div className="space-y-6">
      <PageHeader title="My Subjects" subtitle="Subjects assigned to you" />

      {mySubjects.length === 0 ? (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-slate-500">No subjects assigned yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mySubjects.map((subject) => {
            const subjectClasses = teacher.classIds
              .map((id) => classMap[id])
              .filter(Boolean)
            return (
              <Card key={subject.id} className="p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 font-mono text-xs font-bold text-sky-600">
                    {subject.code}
                  </span>
                  <Badge
                    label={subject.level === 'O' ? 'Ordinary Level' : 'Advanced Level'}
                    tone="sky"
                    dot={false}
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{subject.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Taught in {subjectClasses.length} class{subjectClasses.length === 1 ? '' : 'es'}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {subjectClasses.map((schoolClass) => (
                    <Badge key={schoolClass.id} label={schoolClass.name} tone="violet" dot={false} />
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}