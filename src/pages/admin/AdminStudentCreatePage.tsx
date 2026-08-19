import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentForm } from '../../components/students/StudentForm'
import { PageHeader } from '../../components/ui/PageHeader'
import { useStudents } from '../../context/StudentsContext'
import { useToast } from '../../components/ui/Toast'
import { fullName } from '../../lib/format'

export function AdminStudentCreatePage() {
  const { addStudent, getNextAdmissionNumber } = useStudents()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedNumber, setSuggestedNumber] = useState('')

  useEffect(() => {
    void getNextAdmissionNumber().then(setSuggestedNumber)
  }, [getNextAdmissionNumber])

  const handleSubmit = async (values: Parameters<typeof addStudent>[0]) => {
    setIsSubmitting(true)
    try {
      const created = await addStudent(values)
      showToast(`${fullName(created)} was registered successfully.`)
      navigate(`/admin/students/${created.id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to register student.', 'error')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add Student" subtitle="Register a new student at the school" />
      <StudentForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        defaultAdmissionNumber={suggestedNumber}
      />
    </div>
  )
}