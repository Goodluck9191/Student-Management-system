import { useState, type FormEvent } from 'react'
import type { Teacher, TeacherInput } from '../../types/teacher'
import { TEACHER_STATUS_OPTIONS } from '../../lib/constants'
import { Field, Input, Select } from '../ui/Field'
import { Button } from '../ui/Button'
import { useSubjects } from '../../context/SubjectsContext'
import { useClasses } from '../../context/ClassesContext'

type FormValues = TeacherInput

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  employeeNumber: '',
  email: '',
  phone: '',
  subjectIds: [],
  classIds: [],
  status: 'active',
}

interface TeacherFormProps {
  initialValues?: Teacher
  isSubmitting: boolean
  onSubmit: (values: FormValues) => Promise<void>
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!values.employeeNumber.trim()) errors.employeeNumber = 'Employee number is required.'
  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.phone.trim()) errors.phone = 'Phone number is required.'
  return errors
}

export function TeacherForm({ initialValues, isSubmitting, onSubmit }: TeacherFormProps) {
  const { items: subjects } = useSubjects()
  const { items: classes } = useClasses()

  const [values, setValues] = useState<FormValues>(
    initialValues
      ? {
          firstName: initialValues.firstName,
          middleName: initialValues.middleName,
          lastName: initialValues.lastName,
          employeeNumber: initialValues.employeeNumber,
          email: initialValues.email,
          phone: initialValues.phone,
          subjectIds: [...initialValues.subjectIds],
          classIds: [...initialValues.classIds],
          status: initialValues.status,
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggle = (key: 'subjectIds' | 'classIds', id: string) => {
    setValues((prev) => {
      const selected = prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id]
      return { ...prev, [key]: selected }
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    void onSubmit(values)
  }

  const toggleClasses = (id: string) => toggle('classIds', id)
  const toggleSubjects = (id: string) => toggle('subjectIds', id)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" required error={errors.firstName}>
          <Input
            type="text"
            value={values.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            placeholder="James"
            error={Boolean(errors.firstName)}
          />
        </Field>
        <Field label="Middle Name" hint="Optional">
          <Input
            type="text"
            value={values.middleName}
            onChange={(e) => setField('middleName', e.target.value)}
            placeholder="Mwakapamba"
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <Input
            type="text"
            value={values.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            placeholder="Msoka"
            error={Boolean(errors.lastName)}
          />
        </Field>
        <Field label="Employee Number" required error={errors.employeeNumber}>
          <Input
            type="text"
            value={values.employeeNumber}
            onChange={(e) => setField('employeeNumber', e.target.value)}
            placeholder="EMP-007"
            error={Boolean(errors.employeeNumber)}
          />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="teacher@iyunga.ac.tz"
            error={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="+255 712 345 678"
            error={Boolean(errors.phone)}
          />
        </Field>
        <Field label="Account Status" required>
          <Select
            value={values.status}
            onChange={(e) => setField('status', e.target.value as FormValues['status'])}
          >
            {TEACHER_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Assigned Subjects</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {subjects.map((subject) => {
            const selected = values.subjectIds.includes(subject.id)
            return (
              <label
                key={subject.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                  selected ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSubjects(subject.id)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-slate-800">{subject.name}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Assigned Classes</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {classes.map((schoolClass) => {
            const selected = values.classIds.includes(schoolClass.id)
            return (
              <label
                key={schoolClass.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                  selected ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleClasses(schoolClass.id)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-slate-800">{schoolClass.name}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Add Teacher'}
        </Button>
      </div>
    </form>
  )
}