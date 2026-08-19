import type { Teacher, TeacherInput } from '../types/teacher'
import type { Repository } from './mockRepository'
import { createMockRepository } from './mockRepository'
import { mockTeachers } from '../data/mock/teachers'

export interface TeacherRepository extends Repository<Teacher, TeacherInput> {}

export const teacherService: TeacherRepository = createMockRepository<Teacher, TeacherInput>(
  mockTeachers,
)