import type { StudentStatus } from '../types/student'

export const CLASSES = [
  'Form One',
  'Form Two',
  'Form Three',
  'Form Four',
  'Form Five',
  'Form Six',
] as const

export const COMBINATIONS = [
  'N/A',
  'CBG',
  'CBM',
  'EGM',
  'HGE',
  'HGL',
  'HKL',
  'PCM',
  'PCB',
  'PGM',
  'PMM',
] as const

export const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'graduated', label: 'Graduated' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'transferred', label: 'Transferred' },
]

export const STATUS_LABELS: Record<StudentStatus, string> = {
  active: 'Active',
  graduated: 'Graduated',
  suspended: 'Suspended',
  transferred: 'Transferred',
}

export const GENDER_LABELS = {
  male: 'Male',
  female: 'Female',
} as const

export const SCHOOL_NAME = 'Iyunga Secondary School'
export const SCHOOL_SHORT_NAME = 'Iyunga'
export const SCHOOL_MOTTO = 'Knowledge is Power'

export const PAGE_SIZE = 10
