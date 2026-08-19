import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StudentForm } from '../components/students/StudentForm'
import { PageHeader } from '../components/ui/PageHeader'
import { LoadingState, ErrorState } from '../components/ui/States'
import { useStudents } from '../context/StudentsContext'
import { useToast } from '../components/ui/Toast'
import type { Student, StudentInput } from '../types/student'
import { fullName } from '../lib/format'

export function EditStudentPage() {
  const { id } = useParams<{ id: string }>()
  const { getStudent, updateStudent } = useStudents()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    getStudent(id)
      .then((data) => {
        if (!cancelled) setStudent(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load student.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, getStudent])

  const handleSubmit = async (values: StudentInput) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const updated = await updateStudent(id, values)
      showToast(`${fullName(updated)} was updated successfully.`)
      navigate(`/students/${id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update student.', 'error')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingState label="Loading student…" />
  }

  if (error || !student) {
    return <ErrorState message={error ?? 'Student not found.'} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student"
        subtitle={`Update the record for ${fullName(student)}`}
      />
      <StudentForm initialValues={student} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </div>
  )
}