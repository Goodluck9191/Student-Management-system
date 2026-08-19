export interface Subject {
  id: string
  name: string
  code: string
  level: 'O' | 'A'
  teacherIds: string[]
}

export type SubjectInput = Omit<Subject, 'id'>

export interface SubjectFilters {
  search: string
  level: 'O' | 'A' | ''
}