import type { SchoolClass, SchoolClassInput } from '../types/class'
import type { Repository } from './mockRepository'
import { createMockRepository } from './mockRepository'
import { mockClasses } from '../data/mock/classes'

export interface ClassRepository extends Repository<SchoolClass, SchoolClassInput> {}

export const classService: ClassRepository = createMockRepository<SchoolClass, SchoolClassInput>(
  mockClasses,
)