import { useState, type FormEvent } from 'react'
import type { Parent, ParentInput, Relationship } from '../../types/parent'
import { PARENT_STATUS_OPTIONS, RELATIONSHIP_LABELS } from '../../lib/constants'
import { Field, Input, Select } from '../ui/Field'
import { Button } from '../ui/Button'
import { useStudents } from '../../context/StudentsContext'
import { useClasses } from '../../context/ClassesContext'
import { fullName } from '../../lib/format'
import { toRecord } from '../../lib/selectors'

type FormValues = ParentInput

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  relationship: 'father',
  address: '',
  status: 'active',
  studentIds: [],
}

interface ParentFormProps {
  initialValues?: Parent
  isSubmitting: boolean
  onSubmit: (values: FormValues) => Promise<void>
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.phone.trim()) errors.phone = 'Phone number is required.'
  return errors
}

export function ParentForm({ initialValues, isSubmitting, onSubmit }: ParentFormProps) {
  const { students } = useStudents()
  const { items: classes } = useClasses()
  const classMap = toRecord(classes)

  const [values, setValues] = useState<FormValues>(
    initialValues
      ? {
          firstName: initialValues.firstName,
          lastName: initialValues.lastName,
          email: initialValues.email,
          phone: initialValues.phone,
          relationship: initialValues.relationship,
          address: initialValues.address,
          status: initialValues.status,
          studentIds: [...initialValues.studentIds],
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleStudent = (studentId: string) => {
    setValues((prev) => {
      const selected = prev.studentIds.includes(studentId)
        ? prev.studentIds.filter((id) => id !== studentId)
        : [...prev.studentIds, studentId]
      return { ...prev, studentIds: selected }
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" required error={errors.firstName}>
          <Input
            type="text"
            value={values.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            placeholder="Peter"
            error={Boolean(errors.firstName)}
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <Input
            type="text"
            value={values.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            placeholder="Mwanga"
            error={Boolean(errors.lastName)}
          />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="parent@example.com"
            error={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="+255 754 555 001"
            error={Boolean(errors.phone)}
          />
        </Field>
        <Field label="Relationship" required>
          <Select
            value={values.relationship}
            onChange={(e) => setField('relationship', e.target.value as Relationship)}
          >
            {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Account Status" required>
          <Select
            value={values.status}
            onChange={(e) => setField('status', e.target.value as FormValues['status'])}
          >
            {PARENT_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Input
              type="text"
              value={values.address}
              onChange={(e) => setField('address', e.target.value)}
              placeholder="Iyunga, Mbeya"
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Linked Children</p>
        {students.length === 0 ? (
          <p className="text-sm text-slate-500">No students available yet.</p>
        ) : (
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {students.map((student) => {
              const selected = values.studentIds.includes(student.id)
              return (
                <label
                  key={student.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                    selected ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleStudent(student.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {fullName(student)}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {student.admissionNumber} · {classMap[student.classId]?.name ?? '—'}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Add Parent'}
        </Button>
      </div>
    </form>
  )
}