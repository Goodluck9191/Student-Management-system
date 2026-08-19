export type TeacherStatus = 'active' | 'inactive'

export interface Teacher {
  id: string
  firstName: string
  middleName: string
  lastName: string
  employeeNumber: string
  email: string
  phone: string
  subjectIds: string[]
  classIds: string[]
  status: TeacherStatus
  userId?: string
}

export type TeacherInput = Omit<Teacher, 'id'>

export interface TeacherFilters {
  search: string
  subjectId: string
  status: TeacherStatus | ''
}