import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import type { Gender, Student, StudentInput, StudentStatus } from '../../types/student'
import { CLASSES, COMBINATIONS, STATUS_OPTIONS, GENDER_LABELS } from '../../lib/constants'
import { Field, Input, Select } from '../ui/Field'
import { Button } from '../ui/Button'

type FormValues = StudentInput

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  admissionNumber: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'male',
  dateOfBirth: '',
  className: '',
  combination: 'N/A',
  phoneNumber: '',
  parentName: '',
  parentPhone: '',
  address: '',
  enrollmentDate: new Date().toISOString().slice(0, 10),
  status: 'active',
}

interface StudentFormProps {
  initialValues?: Student
  isSubmitting: boolean
  onSubmit: (values: FormValues) => Promise<void>
  defaultAdmissionNumber?: string
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.admissionNumber.trim()) {
    errors.admissionNumber = 'Admission number is required.'
  }
  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.'
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.'
  }
  if (!values.gender) {
    errors.gender = 'Please select a gender.'
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required.'
  } else {
    const dob = new Date(values.dateOfBirth)
    const today = new Date()
    if (dob > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future.'
    } else {
      const age = today.getFullYear() - dob.getFullYear()
      if (age > 30) {
        errors.dateOfBirth = 'Please check the date of birth.'
      }
    }
  }
  if (!values.className) {
    errors.className = 'Please select a class.'
  }
  if (!values.combination) {
    errors.combination = 'Please select a combination.'
  }
  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required.'
  } else if (!/^\+?[0-9\s-]{9,15}$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber = 'Enter a valid phone number, e.g. +255 712 345 678.'
  }
  if (!values.parentName.trim()) {
    errors.parentName = 'Parent or guardian name is required.'
  }
  if (!values.parentPhone.trim()) {
    errors.parentPhone = 'Parent phone number is required.'
  } else if (!/^\+?[0-9\s-]{9,15}$/.test(values.parentPhone.trim())) {
    errors.parentPhone = 'Enter a valid phone number, e.g. +255 754 100 201.'
  }
  if (!values.enrollmentDate) {
    errors.enrollmentDate = 'Enrollment date is required.'
  }
  if (!values.status) {
    errors.status = 'Please select a status.'
  }

  return errors
}

export function StudentForm({
  initialValues,
  isSubmitting,
  onSubmit,
  defaultAdmissionNumber,
}: StudentFormProps) {
  const navigate = useNavigate()
  const [values, setValues] = useState<FormValues>(
    initialValues
      ? {
          admissionNumber: initialValues.admissionNumber,
          firstName: initialValues.firstName,
          middleName: initialValues.middleName,
          lastName: initialValues.lastName,
          gender: initialValues.gender,
          dateOfBirth: initialValues.dateOfBirth,
          className: initialValues.className,
          combination: initialValues.combination,
          phoneNumber: initialValues.phoneNumber,
          parentName: initialValues.parentName,
          parentPhone: initialValues.parentPhone,
          address: initialValues.address,
          enrollmentDate: initialValues.enrollmentDate,
          status: initialValues.status,
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (defaultAdmissionNumber && values.admissionNumber === '') {
      setValues((prev) => ({ ...prev, admissionNumber: defaultAdmissionNumber }))
    }
  }, [defaultAdmissionNumber, values.admissionNumber])

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      return
    }
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Personal Information</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Basic details about the student
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Admission Number" required error={errors.admissionNumber}>
            <Input
              type="text"
              value={values.admissionNumber}
              onChange={(e) => setField('admissionNumber', e.target.value)}
              placeholder="IY/2026/001"
              error={Boolean(errors.admissionNumber)}
            />
          </Field>
          <Field label="First Name" required error={errors.firstName}>
            <Input
              type="text"
              value={values.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              placeholder="Amina"
              error={Boolean(errors.firstName)}
            />
          </Field>
          <Field label="Middle Name" hint="Optional">
            <Input
              type="text"
              value={values.middleName}
              onChange={(e) => setField('middleName', e.target.value)}
              placeholder="Juma"
            />
          </Field>
          <Field label="Last Name" required error={errors.lastName}>
            <Input
              type="text"
              value={values.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              placeholder="Mwakasege"
              error={Boolean(errors.lastName)}
            />
          </Field>
          <Field label="Gender" required error={errors.gender}>
            <Select
              value={values.gender}
              onChange={(e) => setField('gender', e.target.value as Gender)}
              error={Boolean(errors.gender)}
            >
              {Object.entries(GENDER_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date of Birth" required error={errors.dateOfBirth}>
            <Input
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => setField('dateOfBirth', e.target.value)}
              error={Boolean(errors.dateOfBirth)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Academic Information</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Class, combination and academic status
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Class" required error={errors.className}>
            <Select
              value={values.className}
              onChange={(e) => setField('className', e.target.value)}
              error={Boolean(errors.className)}
            >
              <option value="">Select class</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Combination" required error={errors.combination}>
            <Select
              value={values.combination}
              onChange={(e) => setField('combination', e.target.value)}
              error={Boolean(errors.combination)}
            >
              {COMBINATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Student Status" required error={errors.status}>
            <Select
              value={values.status}
              onChange={(e) => setField('status', e.target.value as StudentStatus)}
              error={Boolean(errors.status)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Contact Information</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            How the student can be reached
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <Field label="Student Phone Number" required error={errors.phoneNumber}>
            <Input
              type="tel"
              value={values.phoneNumber}
              onChange={(e) => setField('phoneNumber', e.target.value)}
              placeholder="+255 712 345 678"
              error={Boolean(errors.phoneNumber)}
            />
          </Field>
          <Field label="Address" hint="Home or village address">
            <Input
              type="text"
              value={values.address}
              onChange={(e) => setField('address', e.target.value)}
              placeholder="Iyunga, Mbeya"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Parent / Guardian</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Parent or guardian contact information
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <Field label="Parent / Guardian Name" required error={errors.parentName}>
            <Input
              type="text"
              value={values.parentName}
              onChange={(e) => setField('parentName', e.target.value)}
              placeholder="Juma Mwakasege"
              error={Boolean(errors.parentName)}
            />
          </Field>
          <Field label="Parent / Guardian Phone" required error={errors.parentPhone}>
            <Input
              type="tel"
              value={values.parentPhone}
              onChange={(e) => setField('parentPhone', e.target.value)}
              placeholder="+255 754 100 201"
              error={Boolean(errors.parentPhone)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Enrollment</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Enrollment details for this academic year
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <Field label="Enrollment Date" required error={errors.enrollmentDate}>
            <Input
              type="date"
              value={values.enrollmentDate}
              onChange={(e) => setField('enrollmentDate', e.target.value)}
              error={Boolean(errors.enrollmentDate)}
            />
          </Field>
          <div className="hidden sm:block" />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {initialValues ? 'Save Changes' : 'Register Student'}
        </Button>
      </div>
    </form>
  )
}