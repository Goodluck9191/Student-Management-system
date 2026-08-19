import type { StudentStatus } from '../types/student'
import type { TeacherStatus } from '../types/teacher'
import type { ParentStatus, Relationship } from '../types/parent'
import type { ResultStatus, Term } from '../types/result'
import type { AnnouncementPriority, AnnouncementAudience } from '../types/announcement'

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

export const TEACHER_STATUS_OPTIONS: { value: TeacherStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const TEACHER_STATUS_LABELS: Record<TeacherStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const PARENT_STATUS_OPTIONS: { value: ParentStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const PARENT_STATUS_LABELS: Record<ParentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  father: 'Father',
  mother: 'Mother',
  guardian: 'Guardian',
  aunt: 'Aunt',
  uncle: 'Uncle',
}

export const RESULT_STATUS_LABELS: Record<ResultStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  published: 'Published',
}

export const TERM_LABELS: Record<Term, string> = {
  1: 'Term 1',
  2: 'Term 2',
  3: 'Term 3',
}

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  normal: 'Normal',
  important: 'Important',
  urgent: 'Urgent',
}

export const ANNOUNCEMENT_AUDIENCE_LABELS: Record<AnnouncementAudience, string> = {
  all: 'Everyone',
  students: 'Students',
  parents: 'Parents',
  teachers: 'Teachers',
  class: 'Specific Class',
}

export const SCHOOL_NAME = 'Iyunga Secondary School'
export const SCHOOL_SHORT_NAME = 'Iyunga'
export const SCHOOL_MOTTO = 'Knowledge is Power'

export const PAGE_SIZE = 10

export const ACADEMIC_YEARS = ['2024', '2025', '2026'] as const

export const CURRENT_ACADEMIC_YEAR = '2026'

export const FORMS = [1, 2, 3, 4, 5, 6] as const

export const SUBJECT_LEVELS = [
  { value: 'O', label: 'Ordinary Level' },
  { value: 'A', label: 'Advanced Level' },
] as const

export const TERMS: Term[] = [1, 2, 3]

export const COMBINATIONS = [
  'PCM',
  'PCB',
  'CBG',
  'PGM',
  'HGE',
  'HKL',
  'HGL',
  'N/A',
] as const