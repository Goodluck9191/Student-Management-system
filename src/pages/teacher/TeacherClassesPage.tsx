import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Users } from 'lucide-react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useSubjects } from '../../context/SubjectsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/States'
import { Badge } from '../../components/ui/Badge'
import { toRecord } from '../../lib/selectors'

export function TeacherClassesPage() {
  const { teacher } = useTeacherIdentity()
  const { students } = useStudents()
  const { items: classes } = useClasses()
  const { items: subjects } = useSubjects()

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  const classMap = toRecord(classes)

  const myClasses = teacher.classIds.map((id) => classMap[id]).filter(Boolean)

  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" subtitle="Classes assigned to you" />

      {myClasses.length === 0 ? (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-slate-500">No classes assigned yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((schoolClass) => {
            const count = students.filter((s) => s.classId === schoolClass.id).length
            const classSubjects = subjects.filter((subject) =>
              teacher.subjectIds.includes(subject.id),
            )
            return (
              <Card key={schoolClass.id} className="p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Badge label={`Form ${schoolClass.form}`} tone="violet" dot={false} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{schoolClass.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {count} students
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {classSubjects.map((subject) => (
                    <Badge key={subject.id} label={subject.name} tone="blue" dot={false} />
                  ))}
                </div>
                <Link
                  to="/teacher/students"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View students
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}