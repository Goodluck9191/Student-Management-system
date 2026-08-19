import { createEntityContext } from './createEntityContext'
import type { Parent, ParentInput } from '../types/parent'
import { parentService } from '../services/parentService'

const { Provider: ParentsProvider, useEntity: useParents } = createEntityContext<
  Parent,
  ParentInput
>(parentService, 'Parents')

export { ParentsProvider, useParents }