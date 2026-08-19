import { useState, type FormEvent } from 'react'
import type { SchoolClass, SchoolClassInput } from '../../types/class'
import { FORMS } from '../../lib/constants'
import { Field, Input, Select } from '../ui/Field'
import { Button } from '../ui/Button'

type FormValues = SchoolClassInput

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  name: '',
  form: 1,
  stream: 'A',
  teacherIds: [],
}

interface ClassFormProps {
  initialValues?: SchoolClass
  isSubmitting: boolean
  onSubmit: (values: FormValues) => Promise<void>
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) {
    errors.name = 'Class name is required.'
  }
  if (!values.stream.trim()) {
    errors.stream = 'Stream is required.'
  }
  return errors
}

export function ClassForm({ initialValues, isSubmitting, onSubmit }: ClassFormProps) {
  const [values, setValues] = useState<FormValues>(
    initialValues
      ? {
          name: initialValues.name,
          form: initialValues.form,
          stream: initialValues.stream,
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
    void onSubmit({ ...values, name: values.name.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <Field label="Class Name" required error={errors.name}>
            <Input
              type="text"
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Form 1A"
              error={Boolean(errors.name)}
            />
          </Field>
        </div>
        <Field label="Form" required>
          <Select
            value={values.form}
            onChange={(e) => setField('form', Number(e.target.value))}
          >
            {FORMS.map((form) => (
              <option key={form} value={form}>
                Form {form}
              </option>
            ))}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Stream" required error={errors.stream}>
            <Input
              type="text"
              value={values.stream}
              onChange={(e) => setField('stream', e.target.value)}
              placeholder="A or B"
              error={Boolean(errors.stream)}
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Add Class'}
        </Button>
      </div>
    </form>
  )
}