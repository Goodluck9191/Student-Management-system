import { useState, type FormEvent } from 'react'
import type {
  Announcement,
  AnnouncementInput,
  AnnouncementAudience,
  AnnouncementPriority,
  AnnouncementStatus,
} from '../../types/announcement'
import {
  ANNOUNCEMENT_AUDIENCE_LABELS,
  ANNOUNCEMENT_PRIORITY_LABELS,
} from '../../lib/constants'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { Button } from '../ui/Button'
import { useClasses } from '../../context/ClassesContext'

type FormValues = AnnouncementInput

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  title: '',
  message: '',
  audience: 'all',
  priority: 'normal',
  authorId: '',
  authorName: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'draft',
}

interface AnnouncementFormProps {
  initialValues?: Announcement
  authorId: string
  authorName: string
  isSubmitting: boolean
  onSubmit: (values: FormValues) => Promise<void>
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.message.trim()) errors.message = 'Message is required.'
  if (values.audience === 'class' && !values.audienceClassId) {
    errors.audienceClassId = 'Select a class for this announcement.'
  }
  return errors
}

export function AnnouncementForm({
  initialValues,
  authorId,
  authorName,
  isSubmitting,
  onSubmit,
}: AnnouncementFormProps) {
  const { items: classes } = useClasses()

  const [values, setValues] = useState<FormValues>(
    initialValues
      ? {
          title: initialValues.title,
          message: initialValues.message,
          audience: initialValues.audience,
          audienceClassId: initialValues.audienceClassId,
          priority: initialValues.priority,
          authorId: initialValues.authorId,
          authorName: initialValues.authorName,
          date: initialValues.date,
          status: initialValues.status,
        }
      : { ...emptyValues, authorId, authorName },
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
    void onSubmit({ ...values, title: values.title.trim(), message: values.message.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Title" required error={errors.title}>
        <Input
          type="text"
          value={values.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Parent Meeting"
          error={Boolean(errors.title)}
        />
      </Field>
      <Field label="Message" required error={errors.message}>
        <Textarea
          value={values.message}
          onChange={(e) => setField('message', e.target.value)}
          placeholder="There will be a parent meeting on Friday…"
          error={Boolean(errors.message)}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Audience" required>
          <Select
            value={values.audience}
            onChange={(e) => setField('audience', e.target.value as AnnouncementAudience)}
          >
            {Object.entries(ANNOUNCEMENT_AUDIENCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        {values.audience === 'class' && (
          <Field label="Class" required error={errors.audienceClassId}>
            <Select
              value={values.audienceClassId ?? ''}
              onChange={(e) => setField('audienceClassId', e.target.value)}
              error={Boolean(errors.audienceClassId)}
            >
              <option value="">Select class</option>
              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Priority" required>
          <Select
            value={values.priority}
            onChange={(e) => setField('priority', e.target.value as AnnouncementPriority)}
          >
            {Object.entries(ANNOUNCEMENT_PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" required>
          <Select
            value={values.status}
            onChange={(e) => setField('status', e.target.value as AnnouncementStatus)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </Field>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Create Announcement'}
        </Button>
      </div>
    </form>
  )
}