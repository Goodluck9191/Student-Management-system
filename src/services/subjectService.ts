import type { Subject, SubjectInput } from '../types/subject'
import type { Repository } from './mockRepository'
import { createMockRepository } from './mockRepository'
import { mockSubjects } from '../data/mock/subjects'

export interface SubjectRepository extends Repository<Subject, SubjectInput> {}

export const subjectService: SubjectRepository = createMockRepository<Subject, SubjectInput>(
  mockSubjects,
)