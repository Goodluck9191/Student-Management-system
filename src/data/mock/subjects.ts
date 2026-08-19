import type { Subject } from '../../types/subject'

export const mockSubjects: Subject[] = [
  { id: 's1', name: 'Mathematics', code: 'MATH', level: 'O', teacherIds: ['t1', 't5'] },
  { id: 's2', name: 'Physics', code: 'PHY', level: 'O', teacherIds: ['t1', 't5'] },
  { id: 's3', name: 'Chemistry', code: 'CHEM', level: 'O', teacherIds: ['t3'] },
  { id: 's4', name: 'Biology', code: 'BIO', level: 'O', teacherIds: ['t3'] },
  { id: 's5', name: 'English', code: 'ENG', level: 'O', teacherIds: ['t2', 't6'] },
  { id: 's6', name: 'Kiswahili', code: 'KIS', level: 'O', teacherIds: ['t2', 't6'] },
  { id: 's7', name: 'History', code: 'HIS', level: 'O', teacherIds: ['t4'] },
  { id: 's8', name: 'Geography', code: 'GEO', level: 'O', teacherIds: ['t4'] },
  { id: 's9', name: 'Civics', code: 'CIV', level: 'O', teacherIds: ['t4'] },
  { id: 's10', name: 'Advanced Mathematics', code: 'AMATH', level: 'A', teacherIds: ['t5'] },
  { id: 's11', name: 'Advanced Physics', code: 'APHYS', level: 'A', teacherIds: ['t5'] },
  { id: 's12', name: 'Advanced Chemistry', code: 'ACHEM', level: 'A', teacherIds: ['t3'] },
]