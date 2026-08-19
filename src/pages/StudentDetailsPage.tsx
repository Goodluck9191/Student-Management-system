import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  GraduationCap,
  Users,
  Phone,
  CalendarDays,
} from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import { useToast } from '../components/ui/Toast'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingState, ErrorState } from '../components/ui/States'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { StatusBadge } from '../components/ui/StatusBadge'
import { StudentAvatar } from '../components/ui/StudentAvatar'
import type { Student } from '../types/student'
import { formatDate, fullName } from '../lib/format'
import { GENDER_LABELS } from '../lib/constants'

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-50 py-3 last:border-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">{value || '—'}</dd>
    </div>
  )
}

function InfoSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <Card>
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 px-5 py-2 sm:grid-cols-2">{children}</dl>
    </Card>
  )
}

export function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { getStudent, deleteStudent } = useStudents()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

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

  const handleDelete = async () => {
    if (!student) return
    try {
      await deleteStudent(student.id)
      showToast(`${fullName(student)} was deleted successfully.`)
      navigate('/students')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete student.', 'error')
    } finally {
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return <LoadingState label="Loading student…" />
  }

  if (error || !student) {
    return (
      <ErrorState
        message={error ?? 'Student not found.'}
        onRetry={() => navigate('/students')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Students
        </Link>
        <PageHeader
          title={fullName(student)}
          subtitle={`${student.admissionNumber} · ${student.className} · ${student.combination}`}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                Delete
              </Button>
              <Link to={`/students/${student.id}/edit`}>
                <Button>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit Student
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <StudentAvatar student={student} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-900">{fullName(student)}</span>
              <StatusBadge status={student.status} />
            </div>
            <p className="text-sm text-slate-500">
              {GENDER_LABELS[student.gender]} · {student.className}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InfoSection icon={<User className="h-4 w-4" />} title="Personal Information">
          <InfoRow label="First Name" value={student.firstName} />
          <InfoRow label="Middle Name" value={student.middleName} />
          <InfoRow label="Last Name" value={student.lastName} />
          <InfoRow label="Gender" value={GENDER_LABELS[student.gender]} />
          <InfoRow label="Date of Birth" value={formatDate(student.dateOfBirth)} />
        </InfoSection>

        <InfoSection icon={<GraduationCap className="h-4 w-4" />} title="Academic Information">
          <InfoRow label="Admission Number" value={student.admissionNumber} />
          <InfoRow label="Class" value={student.className} />
          <InfoRow label="Combination" value={student.combination} />
          <InfoRow label="Status" value={<StatusBadge status={student.status} />} />
        </InfoSection>

        <InfoSection icon={<Users className="h-4 w-4" />} title="Parent / Guardian">
          <InfoRow label="Parent / Guardian Name" value={student.parentName} />
          <InfoRow label="Parent / Guardian Phone" value={student.parentPhone} />
        </InfoSection>

        <InfoSection icon={<Phone className="h-4 w-4" />} title="Contact Information">
          <InfoRow label="Student Phone" value={student.phoneNumber} />
          <InfoRow label="Address" value={student.address} />
        </InfoSection>

        <InfoSection icon={<CalendarDays className="h-4 w-4" />} title="Enrollment">
          <InfoRow label="Enrollment Date" value={formatDate(student.enrollmentDate)} />
        </InfoSection>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete student"
        message={`Are you sure you want to delete ${fullName(student)}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}