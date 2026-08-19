import { useState, type FormEvent } from 'react'
import type { Subject, SubjectInput } from '../../types/subject'
import { SUBJECT_LEVELS } from '../../lib/constants'
import { Field, Input, Select } from '../ui/Field'
import { Button } from '../ui/Button'

type FormValues = SubjectInput

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  name: '',
  code: '',
  level: 'O',
  teacherIds: [],
}

interface SubjectFormProps {
  initialValues?: Subject
  isSubmitting: boolean
  onSubmit: (values: FormValues) => Promise<void>
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Subject name is required.'
  if (!values.code.trim()) errors.code = 'Subject code is required.'
  return errors
}

export function SubjectForm({ initialValues, isSubmitting, onSubmit }: SubjectFormProps) {
  const [values, setValues] = useState<FormValues>(
    initialValues
      ? {
          name: initialValues.name,
          code: initialValues.code,
          level: initialValues.level,
          teacherIds: [...initialValues.teacherIds],
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    void onSubmit({ ...values, name: values.name.trim(), code: values.code.trim().toUpperCase() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Subject Name" required error={errors.name}>
            <Input
              type="text"
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Mathematics"
              error={Boolean(errors.name)}
            />
          </Field>
        </div>
        <Field label="Code" required error={errors.code}>
          <Input
            type="text"
            value={values.code}
            onChange={(e) => setField('code', e.target.value)}
            placeholder="MATH"
            error={Boolean(errors.code)}
          />
        </Field>
        <Field label="Level" required>
          <Select value={values.level} onChange={(e) => setField('level', e.target.value as 'O' | 'A')}>
            {SUBJECT_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Add Subject'}
        </Button>
      </div>
    </form>
  )
}