import type { SchoolClass } from '../../types/class'

export const mockClasses: SchoolClass[] = [
  { id: 'c1', name: 'Form 1A', form: 1, stream: 'A', teacherIds: ['t2', 't3'] },
  { id: 'c2', name: 'Form 1B', form: 1, stream: 'B', teacherIds: ['t2'] },
  { id: 'c3', name: 'Form 2A', form: 2, stream: 'A', teacherIds: ['t1'] },
  { id: 'c4', name: 'Form 2B', form: 2, stream: 'B', teacherIds: ['t6'] },
  { id: 'c5', name: 'Form 3A', form: 3, stream: 'A', teacherIds: ['t3', 't4'] },
  { id: 'c6', name: 'Form 4A', form: 4, stream: 'A', teacherIds: ['t1'] },
  { id: 'c7', name: 'Form 4B', form: 4, stream: 'B', teacherIds: ['t3', 't6'] },
  { id: 'c8', name: 'Form 5A', form: 5, stream: 'A', teacherIds: ['t4', 't5'] },
  { id: 'c9', name: 'Form 5B', form: 5, stream: 'B', teacherIds: ['t5'] },
  { id: 'c10', name: 'Form 6A', form: 6, stream: 'A', teacherIds: ['t4', 't5'] },
  { id: 'c11', name: 'Form 6B', form: 6, stream: 'B', teacherIds: ['t5'] },
]