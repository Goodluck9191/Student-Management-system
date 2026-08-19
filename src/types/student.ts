export type Gender = 'male' | 'female'

export type StudentStatus = 'active' | 'graduated' | 'suspended' | 'transferred'

export interface Student {
  id: string
  admissionNumber: string
  firstName: string
  middleName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  className: string
  combination: string
  phoneNumber: string
  parentName: string
  parentPhone: string
  address: string
  enrollmentDate: string
  status: StudentStatus
}

export type StudentInput = Omit<Student, 'id'>

export interface StudentFilters {
  search: string
  className: string
  status: StudentStatus | ''
  gender: Gender | ''
}
