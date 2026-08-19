import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  GraduationCap,
  Users,
  CalendarDays,
  Phone,
  MapPin,
  ClipboardList,
  Mail,
} from 'lucide-react'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { useParents } from '../../context/ParentsContext'
import { useResults } from '../../context/ResultsContext'
import { useToast } from '../../components/ui/Toast'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { StudentAvatar } from '../../components/ui/StudentAvatar'
import { ResultStatusBadge } from '../../components/results/ResultStatusBadge'
import { Badge } from '../../components/ui/Badge'
import type { Student } from '../../types/student'
import { formatDate, fullName, parentName } from '../../lib/format'
import { GENDER_LABELS, RELATIONSHIP_LABELS, TERM_LABELS } from '../../lib/constants'
import { toRecord } from '../../lib/selectors'

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

export function AdminStudentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { getStudent, deleteStudent } = useStudents()
  const { items: classes } = useClasses()
  const { items: parents } = useParents()
  const { results } = useResults()
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

  const classMap = useMemo(() => toRecord(classes), [classes])
  const parentMap = useMemo(() => toRecord(parents), [parents])
  const linkedParents = student ? student.parentIds.map((pid) => parentMap[pid]).filter(Boolean) : []
  const studentResults = student ? results.filter((r) => r.studentId === student.id) : []
  const publishedCount = studentResults.filter((r) => r.status === 'published').length

  const handleDelete = async () => {
    if (!student) return
    try {
      await deleteStudent(student.id)
      showToast(`${fullName(student)} was deleted successfully.`)
      navigate('/admin/students')
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
        onRetry={() => navigate('/admin/students')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Students
        </Link>
        <PageHeader
          title={fullName(student)}
          subtitle={`${student.admissionNumber} · ${classMap[student.classId]?.name ?? '—'} · ${student.combination}`}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                Delete
              </Button>
              <Link to={`/admin/students/${student.id}/edit`}>
                <Button>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit Student
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <StudentAvatar student={student} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-900">{fullName(student)}</span>
              <StatusBadge status={student.status} />
            </div>
            <p className="text-sm text-slate-500">
              {GENDER_LABELS[student.gender]} · {classMap[student.classId]?.name ?? '—'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Badge label={`${studentResults.length} results`} tone="violet" />
          <Badge label={`${publishedCount} published`} tone="green" />
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
          <InfoRow label="Class" value={classMap[student.classId]?.name ?? '—'} />
          <InfoRow label="Combination" value={student.combination} />
          <InfoRow label="Status" value={<StatusBadge status={student.status} />} />
        </InfoSection>

        <InfoSection icon={<Users className="h-4 w-4" />} title="Parents / Guardians">
          {linkedParents.length === 0 ? (
            <p className="py-3 text-sm text-slate-500">No parent or guardian linked yet.</p>
          ) : (
            linkedParents.map((parent) => (
              <div key={parent.id} className="border-b border-slate-50 py-3 last:border-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {RELATIONSHIP_LABELS[parent.relationship]}
                </dt>
                <dd className="text-sm text-slate-800">{parentName(parent)}</dd>
                <dd className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {parent.phone}
                </dd>
                <dd className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {parent.email}
                </dd>
              </div>
            ))
          )}
        </InfoSection>

        <InfoSection icon={<MapPin className="h-4 w-4" />} title="Address">
          <InfoRow label="Home Address" value={student.address} />
        </InfoSection>

        <InfoSection icon={<CalendarDays className="h-4 w-4" />} title="Enrollment">
          <InfoRow label="Enrollment Date" value={formatDate(student.enrollmentDate)} />
        </InfoSection>

        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Results</h2>
          </div>
          {studentResults.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500">No results entered for this student yet.</p>
          ) : (
            <div className="overflow-x-auto px-5 py-2">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-2 font-semibold">Term</th>
                    <th className="py-2 font-semibold">Year</th>
                    <th className="py-2 font-semibold">Marks</th>
                    <th className="py-2 font-semibold">Grade</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentResults.slice(0, 8).map((result) => (
                    <tr key={result.id}>
                      <td className="py-2 text-slate-700">{TERM_LABELS[result.term]}</td>
                      <td className="py-2 text-slate-700">{result.academicYear}</td>
                      <td className="py-2 font-semibold text-slate-900">{result.marks}</td>
                      <td className="py-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                          {result.grade}
                        </span>
                      </td>
                      <td className="py-2">
                        <ResultStatusBadge status={result.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
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