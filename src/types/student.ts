export type Gender = 'male' | 'female'

export type StudentStatus = 'active' | 'graduated' | 'suspended' | 'transferred'

/**
 * A student is a learner, NOT a contact user. Students have no phone number
 * or email. All contact information for a student is handled through their
 * parent/guardian account(s), referenced via `parentIds`.
 */
export interface Student {
  id: string
  admissionNumber: string
  firstName: string
  middleName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  classId: string
  combination: string
  address: string
  enrollmentDate: string
  status: StudentStatus
  parentIds: string[]
}

export type StudentInput = Omit<Student, 'id'>

export interface StudentFilters {
  search: string
  classId: string
  status: StudentStatus | ''
  gender: Gender | ''
}