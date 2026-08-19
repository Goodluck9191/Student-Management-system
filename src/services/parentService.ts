import type { Parent, ParentInput } from '../types/parent'
import type { Repository } from './mockRepository'
import { createMockRepository } from './mockRepository'
import { mockParents } from '../data/mock/parents'

export interface ParentRepository extends Repository<Parent, ParentInput> {}

export const parentService: ParentRepository = createMockRepository<Parent, ParentInput>(
  mockParents,
)