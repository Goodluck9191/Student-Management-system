export type ParentStatus = 'active' | 'inactive'

export type Relationship = 'father' | 'mother' | 'guardian' | 'aunt' | 'uncle'

export interface Parent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: Relationship
  address: string
  status: ParentStatus
  studentIds: string[]
  userId?: string
}

export type ParentInput = Omit<Parent, 'id'>

export interface ParentFilters {
  search: string
  status: ParentStatus | ''
}