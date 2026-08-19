import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useTeacherIdentity } from '../../hooks/useTeacherIdentity'
import { useStudents } from '../../context/StudentsContext'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'
import { useResults } from '../../context/ResultsContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/States'
import { useToast } from '../../components/ui/Toast'
import { ACADEMIC_YEARS, CURRENT_ACADEMIC_YEAR, TERM_LABELS, TERMS } from '../../lib/constants'
import { fullName, gradeForMarks, round } from '../../lib/format'
import { toRecord } from '../../lib/selectors'
import type { Term } from '../../types/result'
import type { Subject } from '../../types/subject'

export function EnterResultsPage() {
  const { teacher } = useTeacherIdentity()
  const { students } = useStudents()
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()
  const { create } = useResults()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const classMap = useMemo(() => toRecord(classes), [classes])

  const myStudents = useMemo(() => {
    if (!teacher) return []
    return students.filter((student) => teacher.classIds.includes(student.classId))
  }, [students, teacher])

  const mySubjects = useMemo(() => {
    if (!teacher) return []
    return teacher.subjectIds
      .map((id) => subjects.find((s) => s.id === id))
      .filter((subject): subject is Subject => Boolean(subject))
  }, [subjects, teacher])

  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [term, setTerm] = useState<Term>(1)
  const [academicYear, setAcademicYear] = useState(CURRENT_ACADEMIC_YEAR)
  const [marks, setMarks] = useState('')
  const [teacherComment, setTeacherComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const numericMarks = Number(marks)
  const grade = marks !== '' && !Number.isNaN(numericMarks) ? gradeForMarks(numericMarks) : '—'
  const averagePreview =
    marks !== '' && !Number.isNaN(numericMarks) ? round(numericMarks) : 0

  useEffect(() => {
    if (!teacher || myStudents.length === 0) return
    setStudentId((current) => current || myStudents[0].id)
    setSubjectId((current) => current || (teacher.subjectIds[0] ?? ''))
  }, [teacher, myStudents])

  if (!teacher) {
    return <ErrorState message="No teacher profile is linked to this account." />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!studentId || !subjectId) {
      setError('Please select a student and a subject.')
      return
    }
    if (marks === '' || Number.isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
      setError('Marks must be a number between 0 and 100.')
      return
    }
    setIsSubmitting(true)
    try {
      await create({
        studentId,
        subjectId,
        term,
        academicYear,
        marks: numericMarks,
        grade: gradeForMarks(numericMarks),
        teacherComment: teacherComment.trim(),
        status: 'draft',
        teacherId: teacher.id,
      })
      showToast('Result saved as a draft. Submit it for approval when ready.')
      navigate('/teacher/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save result.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Enter Results" subtitle="Record a student result as a draft" />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Student" required>
              <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {myStudents.length === 0 && <option value="">No students in your classes</option>}
                {myStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {fullName(student)} · {classMap[student.classId]?.name ?? '—'}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Subject" required>
              <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {mySubjects.length === 0 && <option value="">No subjects assigned</option>}
                {mySubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Term" required>
              <Select value={term} onChange={(e) => setTerm(Number(e.target.value) as Term)}>
                {TERMS.map((t) => (
                  <option key={t} value={t}>
                    {TERM_LABELS[t]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Academic Year" required>
              <Select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Marks (0–100)" required>
              <Input
                type="number"
                min={0}
                max={100}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="82"
              />
            </Field>
            <Field label="Grade (auto)">
              <div className="flex h-10 items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-base font-bold text-brand-700">
                  {grade}
                </span>
                <span className="text-xs text-slate-400">Average preview: {averagePreview}%</span>
              </div>
            </Field>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Teacher Comment" hint="Optional feedback for the student and parent">
                <Textarea
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  placeholder="Good improvement."
                />
              </Field>
            </div>
          </div>

          {error && (
            <p role="alert" className="mx-5 mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/teacher/results')} disabled={isSubmitting}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Result
            </Button>
          </div>
        </Card>
      </form>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <InfoIcon />
        </span>
        <p className="text-sm leading-relaxed text-slate-500">
          Saved results start as <strong>Draft</strong>. Submit them for review by the
          administrator, who will approve and publish them. Only published results are visible
          to parents.
        </p>
      </div>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}