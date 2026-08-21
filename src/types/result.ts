export type ResultStatus = 'draft' | 'submitted' | 'approved' | 'published'

export const RESULT_STATUSES: ResultStatus[] = ['draft', 'submitted', 'approved', 'published']

export const TERMS = [1, 2, 3] as const

export type Term = (typeof TERMS)[number]

export interface Result {
  id: string
  studentId: string
  subjectId: string
  term: Term
  academicYear: string
  marks: number
  grade: string
  teacherComment: string
  status: ResultStatus
  teacherId: string
  /** ISO timestamp recorded when the result was published. */
  publishedAt?: string
}

export type ResultInput = Omit<Result, 'id'>

export interface ResultFilters {
  studentId: string
  subjectId: string
  term: Term | ''
  status: ResultStatus | ''
  academicYear: string
}