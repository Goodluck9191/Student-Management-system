export interface SchoolClass {
  id: string
  name: string
  form: number
  stream: string
  teacherIds: string[]
}

export type SchoolClassInput = Omit<SchoolClass, 'id'>

export interface ClassFilters {
  search: string
  form: number | ''
}